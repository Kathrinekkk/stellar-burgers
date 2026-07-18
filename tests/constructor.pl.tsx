import { test, expect } from '@playwright/test';

test.describe('E2E тесты: Конструктор бургера и оформление заказа', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('accessToken', 'Bearer mock-access-token');
      document.cookie = "refreshToken=mock-refresh-token; path=/";
    });
    await page.routeFromHAR('tests/hars/ingredients.har', { url: '**/api/ingredients', update: false });
    await page.routeFromHAR('tests/hars/user.har', { url: '**/api/auth/user', update: false });
    await page.routeFromHAR('tests/hars/order.har', { url: '**/api/orders', update: false });

    await page.route('**/api/*', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        return route.fulfill({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*'
          }
        });
      }
      route.fallback();
    });

    await page.goto('http://localhost:4000');
  });

  test('открытие, закрытие модального окна и проверка данных ингредиента', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-item"]');

    const bun = page.locator('[data-testid="ingredient-item"]').filter({ hasText: 'Краторная булка N-200i' }).first();
    
    await bun.click();
    const modal = page.locator('[data-testid="modal"]');
    
    await expect(modal).toBeVisible();
    
    await expect(modal.locator('text=Краторная булка N-200i')).toBeVisible();
    await expect(modal.locator('text=Калории')).toBeVisible(); 

    await page.locator('[data-testid="modal-close-button"]').click();
    await expect(modal).toBeHidden();

    await bun.click();
    await expect(modal).toBeVisible();
    await page.locator('[data-testid="modal-overlay"]').click({ position: { x: 5, y: 5 } });
    await expect(modal).toBeHidden();
  });

  test('создание заказа: сборка бургера, модалка с номером, очистка конструктора', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-item"]');

    const bun = page.locator('[data-testid="ingredient-item"]').filter({ hasText: 'Краторная булка N-200i' }).first();
    const filling = page.locator('[data-testid="ingredient-item"]').filter({ hasText: 'Мясо бессмертных моллюсков Protostomia' }).first();
    const constructorArea = page.locator('[data-testid="constructor-drop-target"]');

    await bun.locator('button:has-text("Добавить")').click();
    await filling.locator('button:has-text("Добавить")').click();

    const orderButton = page.locator('button', { hasText: 'Оформить заказ' });
    await expect(orderButton).toBeEnabled();
    await orderButton.click();

    const orderModal = page.locator('[data-testid="modal"]');
    await expect(orderModal).toBeVisible();
    await expect(orderModal.locator('text=424242')).toBeVisible();

    await page.locator('[data-testid="modal-close-button"]').click();
    await expect(orderModal).toBeHidden();

    const constructorBun = page.locator('[data-testid="constructor-bun-top"]');
    const constructorIngredients = page.locator('[data-testid="constructor-ingredient"]');
    
    await expect(constructorBun).toBeHidden();
    await expect(constructorIngredients).toHaveCount(0);
  });
});
