import { test, expect } from '@playwright/test';

test.describe('E2E тесты: Конструктор бургера и оформление заказа', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('accessToken', 'Bearer mock-access-token');
      document.cookie = "refreshToken=mock-refresh-token; path=/";
    });

    await page.route('**/api/**', async (route) => {
      const request = route.request();
      
      if (request.method() === 'OPTIONS') {
        return route.fulfill({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*'
          }
        });
      }
      
      if (request.url().includes('/auth/user')) {
        return route.fulfill({ 
          status: 200, 
          contentType: 'application/json', 
          body: JSON.stringify({ success: true, user: { name: 'Test User', email: 'test@yandex.ru' } }) 
        });
      }
      
      if (request.url().includes('/orders')) {
        return route.fulfill({ 
          status: 200, 
          contentType: 'application/json', 
          body: JSON.stringify({ success: true, name: 'Space Краторный бургер', order: { number: 424242 } }) 
        });
      }

      route.fallback();
    });

    await page.routeFromHAR('tests/hars/ingredients.har', { url: '**/api/ingredients', update: false, notFound: 'fallback' });
    await page.routeFromHAR('tests/hars/user.har', { url: '**/api/auth/user', update: false, notFound: 'fallback' });
    await page.routeFromHAR('tests/hars/order.har', { url: '**/api/orders', update: false, notFound: 'fallback' });

    await page.goto('/');
  });

  test('открытие, закрытие модального окна и проверка данных ингредиента', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-item"]');

    const bun = page.getByTestId('ingredient-item').filter({ hasText: 'Краторная булка N-200i' }).first();
    
    await bun.click();
    const modal = page.getByTestId('modal');
    
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=Краторная булка N-200i')).toBeVisible();
    
    await expect(modal.locator('text=420')).toBeVisible(); 

    await page.getByTestId('modal-close-button').click();
    await expect(modal).toBeHidden();

    await bun.click();
    await expect(modal).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(modal).toBeHidden();
  });

  test('создание заказа: сборка бургера, модалка с номером, очистка конструктора', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-item"]');

    const bun = page.getByTestId('ingredient-item').filter({ hasText: 'Краторная булка N-200i' }).first();
    const filling = page.getByTestId('ingredient-item').filter({ hasText: 'Мясо бессмертных моллюсков Protostomia' }).first();

    await bun.locator('button:has-text("Добавить")').click();
    await filling.locator('button:has-text("Добавить")').click();

    const constructorBun = page.getByTestId('constructor-bun-top');
    const constructorIngredients = page.getByTestId('constructor-ingredient');
    
    await expect(constructorBun).toContainText('Краторная булка N-200i');
    await expect(constructorIngredients).toContainText('Мясо бессмертных моллюсков Protostomia');

    const orderButton = page.locator('button', { hasText: 'Оформить заказ' });
    await expect(orderButton).toBeEnabled();
    await orderButton.click();

    const orderModal = page.getByTestId('modal');
    await expect(orderModal).toBeVisible();
    await expect(orderModal.locator('text=424242')).toBeVisible();

    await page.getByTestId('modal-close-button').click();
    await expect(orderModal).toBeHidden();

    await expect(constructorBun).toBeHidden();
    await expect(constructorIngredients).toHaveCount(0);
  });
});
