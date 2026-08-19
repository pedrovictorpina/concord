import { expect, test } from '@playwright/test'

test.describe('identidade e temas', () => {
  test('segue a preferência de cor do dispositivo no modo sistema', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    await expect(page).toHaveTitle('Concord // Alpha 01')
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

    await expect.poll(() => page.evaluate(() => localStorage.getItem('concord.theme.v1')))
      .toContain('"colorMode":"light"')
  })

  test('exibe os campos do cadastro inicial', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('tab', { name: 'Criar conta' }).click()

    await expect(page.getByLabel('Nickname')).toBeVisible()
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
    await expect(page.getByRole('button', { name: 'CRIAR IDENTIDADE' })).toBeEnabled()
  })

  test('abre e fecha o fluxo de recuperação de senha', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Esqueci minha senha' }).click()

    await expect(page.getByRole('heading', { name: 'Reative seu sinal.' })).toBeVisible()
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByRole('button', { name: 'ENVIAR LINK SEGURO' })).toBeEnabled()

    await page.getByRole('button', { name: 'Voltar para o login' }).click()
    await expect(page.getByRole('heading', { name: 'Bom ter você de volta.' })).toBeVisible()
  })

  test('permite escolher manter a sessão no login', async ({ page }) => {
    await page.goto('/')

    const keepSession = page.getByLabel('Manter conectado')
    await expect(keepSession).toBeChecked()
    await keepSession.uncheck()
    await expect(keepSession).not.toBeChecked()
  })

  test('abre a demonstração da comunidade e envia uma mensagem local', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()

    await expect(page.getByRole('heading', { name: /Concord\. Em sintonia\./ })).toBeVisible()
    await page.getByRole('textbox', { name: 'Mensagem' }).fill('Temas funcionando')
    await page.getByRole('textbox', { name: 'Mensagem' }).press('Enter')
    await expect(page.getByText('Temas funcionando')).toBeVisible()

    await page.getByRole('button', { name: 'sala-da-madrugada' }).click()
    await expect(page.getByText('SALA-DA-MADRUGADA', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Compartilhar tela' })).toBeEnabled()
    await page.getByRole('button', { name: 'Compartilhar tela' }).click()
    await expect(page.getByRole('dialog', { name: 'Qualidade da transmissao' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Automatica/ })).toBeVisible()
    await page.getByRole('button', { name: 'Fechar seletor de qualidade' }).click()

    await page.getByRole('button', { name: 'Amigos e convites' }).click()
    await expect(page.getByRole('heading', { name: 'Pessoas em sintonia.' })).toBeVisible()
    await page.getByRole('button', { name: 'Fechar pessoas e convites' }).click()
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
