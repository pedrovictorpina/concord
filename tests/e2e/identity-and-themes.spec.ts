import { expect, test } from '@playwright/test'

test.describe('identidade e temas', () => {
  test('segue a preferência de cor do dispositivo no modo sistema', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'light')
    await expect(page.getByRole('button', { name: 'Sistema' })).toHaveAttribute('aria-pressed', 'true')

    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'dark')
  })

  test('alterna e persiste o modo escolhido', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Claro' }).click()

    await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'light')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'light')
    await expect(page.getByRole('button', { name: 'Claro' })).toHaveAttribute('aria-pressed', 'true')

    await expect.poll(() => page.evaluate(() => localStorage.getItem('darkcord.theme.v1')))
      .toContain('"colorMode":"light"')
  })

  test('exibe o cadastro inicial e informa quando o Supabase não está configurado', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('tab', { name: 'Criar conta' }).click()

    await page.getByLabel('Nickname').fill('Pedro')
    await page.getByLabel('E-mail').fill('pedro@example.com')
    await page.getByLabel('Senha').fill('SenhaTeste123')
    await page.getByRole('button', { name: 'CRIAR IDENTIDADE' }).click()

    await expect(page.getByRole('status')).toContainText('Supabase ainda nao configurado')
  })

  test('abre a demonstração e envia uma mensagem local', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()

    await expect(page.getByRole('heading', { name: /Um sinal/ })).toBeVisible()
    await page.getByRole('textbox', { name: 'Mensagem' }).fill('Temas funcionando')
    await page.getByRole('textbox', { name: 'Mensagem' }).press('Enter')
    await expect(page.getByText('Temas funcionando')).toBeVisible()
  })

  test('mantém a autenticação utilizável em viewport móvel', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'ENTRE. FALE. PERMANEÇA.' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'ENTRAR NA REDE' })).toBeVisible()

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  })
})
