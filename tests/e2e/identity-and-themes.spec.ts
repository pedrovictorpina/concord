import { expect, test } from '@playwright/test'

test.describe('identidade e temas', () => {
  test('inicia sem erro de script', async ({ page }) => {
    const pageErrors: Error[] = []
    page.on('pageerror', (error) => pageErrors.push(error))
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Bom ter você de volta.' })).toBeVisible()
    expect(pageErrors).toEqual([])
  })

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

    await expect(page.locator('.voice-member')).toHaveCount(0)
    await page.getByRole('button', { name: '◖ sala-da-madrugada', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'sala-da-madrugada' })).toBeVisible()
    await page.getByRole('button', { name: 'Entrar na chamada de voz' }).click()
    await expect(page.getByText('Você está em voz.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'TELA' })).toBeEnabled()
    await expect(page.locator('.voice-member')).toContainText('conectado')
    await expect(page.getByText('Concord Bot')).toHaveCount(0)
    await page.getByRole('button', { name: 'TELA' }).click()
    await expect(page.getByRole('dialog', { name: 'Qualidade da transmissao' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Automatica/ })).toBeVisible()
    await page.getByRole('button', { name: 'Fechar seletor de qualidade' }).click()

    await page.getByRole('button', { name: 'Amigos e convites' }).click()
    await expect(page.getByRole('heading', { name: 'Pessoas em sintonia.' })).toBeVisible()
    await page.getByRole('button', { name: 'Fechar pessoas e convites' }).click()
  })

  test('exibe a tela inicial de mensagens e o atalho para adicionar amigo', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Inicio do Concord' }).click()

    await expect(page.getByRole('heading', { name: 'Mensagens' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Ari/ })).toBeVisible()
    await page.locator('.friends-add').click()
    await expect(page.getByRole('heading', { name: 'Pessoas em sintonia.' })).toBeVisible()
  })

  test('abre uma mensagem privada com um amigo', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Inicio do Concord' }).click()
    await page.getByRole('button', { name: /Ari/ }).click()
    await expect(page.getByText('Conversa com Ari')).toBeVisible()
    await page.getByLabel('Mensagem privada').fill('Sinal privado')
    await page.getByLabel('Mensagem privada').press('Enter')
    await expect(page.getByText('Sinal privado')).toBeVisible()
  })

  test('administra canais e preferências pela central de configurações', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Abrir configurações' }).click()

    await expect(page.getByRole('heading', { name: 'Configurações.' })).toBeVisible()
    await page.getByRole('button', { name: 'Servidores', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Gerenciar servidores' })).toBeVisible()
    await page.getByRole('button', { name: 'GERENCIAR' }).click()
    await expect(page.getByRole('heading', { name: 'Informações do servidor' })).toBeVisible()
    await page.getByRole('button', { name: 'Tema', exact: true }).click()
    await page.getByRole('dialog', { name: 'Configurações.' }).getByLabel('Estilo').selectOption('ios')
    await expect(page.locator('html')).toHaveAttribute('data-style-theme', 'ios')

    await page.getByRole('button', { name: 'Canais' }).click()
    await page.getByLabel('Nome do canal').fill('planejamento')
    await page.getByLabel('Tipo').selectOption('voice')
    await page.getByRole('button', { name: 'CRIAR CANAL' }).click()
    await expect(page.getByText('◖ planejamento')).toBeVisible()

    await page.getByRole('button', { name: 'Notificações' }).click()
    await page.getByLabel('Silenciar servidor').check()
    await expect(page.getByText('Servidor silenciado.')).toBeVisible()
    await page.getByRole('button', { name: 'Fechar configurações' }).click()
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

  test('abre os canais pela navegação móvel', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: /Canais/ }).click()
    await expect(page.getByRole('button', { name: 'Fechar canais' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'geral' })).toBeVisible()
  })

  test('oferece o fluxo móvel de adicionar amigos por identificador', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: /Mensagens/ }).click()
    await expect(page.getByRole('heading', { name: 'Mensagens' })).toBeVisible()
    await page.locator('.friends-add').click()
    await expect(page.getByRole('heading', { name: 'Adicionar amigos' })).toBeVisible()
    await page.getByRole('button', { name: 'Adicionar via nome de usuário' }).click()
    await expect(page.getByRole('heading', { name: 'Adicionar via nome de usuário' })).toBeVisible()
    await expect(page.getByPlaceholder('Insira um nome de usuário')).toBeVisible()
  })

  test('expõe o manifesto para instalação como PWA', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest')
    const manifest = await page.request.get('/manifest.webmanifest')
    expect(manifest.ok()).toBeTruthy()
  })
})
