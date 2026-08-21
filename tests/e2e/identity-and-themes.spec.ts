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
    await page.getByRole('button', { name: 'Concord', exact: true }).click()

    await expect(page.getByText('Fundacao sincronizada. O primeiro sinal da rede esta no ar.')).toBeVisible()
    await page.getByRole('textbox', { name: 'Mensagem' }).fill('Temas funcionando')
    await page.getByRole('textbox', { name: 'Mensagem' }).press('Enter')
    await expect(page.getByText('Temas funcionando')).toBeVisible()

    await expect(page.locator('.voice-member')).toHaveCount(0)
    await page.getByRole('button', { name: 'sala-da-madrugada', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'sala-da-madrugada' })).toBeVisible()
    await expect(page.getByText('Você está em voz.')).toBeVisible()

    const voiceLayout = await page.locator('.app-shell').evaluate((app) => {
      const appBox = app.getBoundingClientRect()
      const flowChildren = Array.from(app.children).filter((child) => {
        const style = getComputedStyle(child)
        return style.display !== 'none' && style.position !== 'fixed'
      })
      const contentBottom = Math.max(...flowChildren.map((child) => child.getBoundingClientRect().bottom))
      return { appHeight: appBox.height, contentHeight: contentBottom - appBox.top }
    })
    expect(voiceLayout.contentHeight).toBeCloseTo(voiceLayout.appHeight, 0)

    const roomControls = page.locator('.voice-room-controls')
    await expect(roomControls.getByRole('button', { name: 'TELA' })).toBeEnabled()
    await expect(page.locator('.voice-member')).toContainText('conectado')
    await expect(page.getByText('Concord Bot')).toHaveCount(0)
    await roomControls.getByRole('button', { name: 'TELA' }).click()
    await expect(page.getByRole('dialog', { name: 'Qualidade da transmissao' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Automatica/ })).toBeVisible()
    await page.getByRole('button', { name: 'Fechar seletor de qualidade' }).click()

    await page.getByRole('button', { name: 'Amigos e convites' }).click()
    await expect(page.getByRole('heading', { name: 'Pessoas em sintonia.' })).toBeVisible()
    await page.getByRole('button', { name: 'Fechar pessoas e convites' }).click()
  })

  test('encerra a sessão pelas configurações', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Sair do Concord' })).toHaveCount(0)

    await page.getByRole('button', { name: 'Abrir configurações' }).click()
    const dialog = page.getByRole('dialog', { name: 'Configurações.' })
    await dialog.getByRole('tab', { name: 'Sair da conta' }).click()
    await expect(dialog.getByRole('heading', { name: 'Sessão', level: 1 })).toBeVisible()
    await dialog.getByRole('button', { name: 'SAIR DA DEMONSTRAÇÃO' }).click()

    await expect(page.getByRole('button', { name: 'Explorar demonstração local' })).toBeVisible()
  })

  test('convida amigos para o servidor pelo atalho do cabeçalho', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()
    await page.getByRole('button', { name: 'Convidar amigos' }).click()

    const dialog = page.getByRole('dialog', { name: /Convidar/ })
    await expect(dialog).toContainText('Convidar para Concord.')
    await expect(dialog).toContainText('SEUS AMIGOS — 2')
    await expect(dialog.getByText('@ari')).toBeVisible()
    await expect(dialog.getByText('JÁ É MEMBRO')).toBeVisible()

    const convidar = dialog.getByRole('button', { name: 'CONVIDAR' })
    await expect(convidar).toHaveCount(1)

    await dialog.getByLabel('Buscar pessoas').fill('nina')
    await expect(dialog.getByText('@nina')).toBeVisible()
    await expect(dialog.getByText('@ari')).toHaveCount(0)

    await dialog.getByLabel('Buscar pessoas').fill('zzz')
    await expect(dialog.getByText('Nenhum amigo corresponde a essa busca.')).toBeVisible()

    await dialog.getByRole('button', { name: 'GERAR LINK DE CONVITE' }).click()
    await expect(dialog.getByText('Entre com sua conta para gerar links de convite.')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  })

  test('lista os membros do servidor e seus cargos', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()

    const panel = page.getByRole('complementary', { name: 'Membros do servidor' })
    await expect(panel).toContainText('3 NO SERVIDOR')
    await expect(panel).toContainText('PROPRIETARIO — 1')
    await expect(panel).toContainText('MODERADORES — 1')
    await expect(panel).toContainText('MEMBROS — 1')
    await expect(panel.getByText('@fundador · proprietário')).toBeVisible()
    await expect(panel.getByText('@ari · moderador')).toBeVisible()
    await expect(panel.getByText('@rafa · membro')).toBeVisible()

    await page.getByRole('button', { name: 'sala-da-madrugada', exact: true }).click()
    await expect(panel).toHaveCount(0)
  })

  test('administra um membro pelo painel de membros', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()

    const memberPanel = page.getByRole('complementary', { name: 'Membros do servidor' })
    await expect(memberPanel).toContainText('Rafa')
    await memberPanel.getByRole('button', { name: 'Administrar Rafa' }).click()
    await page.getByRole('menuitem', { name: 'Remover do servidor' }).click()

    await expect(page.getByRole('dialog')).toContainText('Remover do servidor')
    await page.getByRole('button', { name: 'REMOVER' }).click()
    await expect(memberPanel).not.toContainText('Rafa')
  })

  test('abre o menu de contexto de um membro com o botão direito', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()

    const memberPanel = page.getByRole('complementary', { name: 'Membros do servidor' })
    await memberPanel.getByText('Rafa', { exact: true }).click({ button: 'right' })

    const menu = page.getByRole('menu', { name: 'Opções de Rafa' })
    await expect(menu).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: 'Promover a moderador' })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: 'Silenciar voz no servidor' })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: 'Banir do servidor' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(menu).toHaveCount(0)
  })

  test('mantém o dock de voz acima do perfil na tela inicial', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()
    await page.getByRole('button', { name: 'sala-da-madrugada', exact: true }).click()
    await expect(page.getByText('Você está em voz.')).toBeVisible()
    await page.getByRole('button', { name: 'Inicio do Concord' }).click()

    const dock = page.getByRole('complementary', { name: 'Conexao de voz' })
    const identity = page.locator('.home-sidebar .identity-strip')
    const dockBox = await dock.boundingBox()
    const identityBox = await identity.boundingBox()
    expect(dockBox!.y + dockBox!.height).toBeLessThanOrEqual(identityBox!.y + 1)
  })

  test('mostra os controles da transmissão ao passar o mouse', async ({ page }) => {
    await page.addInitScript(() => {
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = 360
      const stream = (canvas as HTMLCanvasElement & { captureStream: (fps: number) => MediaStream }).captureStream(5)
      Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', { value: async () => stream, configurable: true })
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()
    await page.getByRole('button', { name: 'sala-da-madrugada', exact: true }).click()
    await expect(page.getByText('Você está em voz.')).toBeVisible()

    const roomControls = page.locator('.voice-room-controls')
    await roomControls.getByRole('button', { name: 'TELA' }).click()
    await page.getByRole('button', { name: /Automatica/ }).click()

    const tile = page.locator('.voice-stage-share').first()
    const bar = tile.locator('.voice-stage-bar')
    await expect(tile).toBeVisible()
    expect(await bar.evaluate((element) => getComputedStyle(element).opacity)).toBe('0')

    await tile.hover()
    await expect.poll(async () => bar.evaluate((element) => getComputedStyle(element).opacity)).toBe('1')
    await expect(bar.getByRole('button', { name: /Destacar a tela/ })).toBeVisible()
    await expect(bar.getByRole('button', { name: /tela cheia/ })).toBeVisible()
  })

  test('ajusta a supressão de ruído nas configurações de voz', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('navigation', { name: 'Servidores' }).getByRole('button', { name: 'Abrir configurações' }).click()
    await page.getByRole('tab', { name: 'Voz e áudio' }).click()

    const suppression = page.getByLabel('Supressão de ruído')
    await expect(page.getByRole('radio', { name: /^Voz/ })).toHaveAttribute('aria-checked', 'true')
    await expect(suppression).toBeDisabled()

    await page.getByRole('radio', { name: /Personalizado/ }).click()
    await expect(suppression).toBeEnabled()
    await suppression.selectOption('off')
    await expect(suppression).toHaveValue('off')

    const gain = page.getByRole('checkbox', { name: 'Ganho automático' })
    await gain.click()
    await expect(gain).not.toBeChecked()

    await page.reload()
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('navigation', { name: 'Servidores' }).getByRole('button', { name: 'Abrir configurações' }).click()
    await page.getByRole('tab', { name: 'Voz e áudio' }).click()

    await expect(page.getByLabel('Supressão de ruído')).toHaveValue('webrtc')
    await expect(page.getByRole('checkbox', { name: 'Ganho automático' })).not.toBeChecked()
  })

  test('mantém a conexão de voz ao navegar entre canais', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()

    await page.getByRole('button', { name: 'sala-da-madrugada', exact: true }).click()
    await expect(page.getByText('Você está em voz.')).toBeVisible()

    const dock = page.getByRole('complementary', { name: 'Conexao de voz' })
    await expect(page.locator('.voice-room > header')).toContainText('sala-da-madrugada')
    await expect(page.locator('.voice-member')).toHaveCount(1)

    await page.getByRole('button', { name: '# geral', exact: true }).click()
    await expect(page.getByRole('textbox', { name: 'Mensagem' })).toBeVisible()
    await expect(dock).toContainText('sala-da-madrugada')
    await expect(page.locator('.voice-member')).toContainText('conectado')

    await dock.getByRole('button', { name: 'Microfone ligado' }).click()
    await expect(page.locator('.voice-member')).toContainText('sem microfone')
    await expect(page.locator('.voice-member .voice-flag[aria-label="Microfone mutado"]')).toBeVisible()

    await dock.getByRole('button', { name: 'SAIR' }).click()
    await expect(dock).toHaveCount(0)
    await expect(page.locator('.voice-member')).toHaveCount(0)
  })

  test('mutar o áudio também muta o microfone', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()

    await page.getByRole('button', { name: 'sala-da-madrugada', exact: true }).click()
    await expect(page.getByText('Você está em voz.')).toBeVisible()

    const roomControls = page.locator('.voice-room-controls')
    await roomControls.getByRole('button', { name: 'Áudio ligado' }).click()

    await expect(roomControls.getByRole('button', { name: 'Microfone mutado' })).toBeVisible()
    await expect(page.locator('.voice-member')).toContainText('sem áudio')
    await expect(page.locator('.voice-member .voice-flag[aria-label="Áudio mutado"]')).toBeVisible()
    await expect(page.locator('.voice-member .voice-flag[aria-label="Microfone mutado"]')).toBeVisible()

    await roomControls.getByRole('button', { name: 'Áudio mutado' }).click()
    await expect(roomControls.getByRole('button', { name: 'Microfone ligado' })).toBeVisible()
    await expect(page.locator('.voice-member')).toContainText('conectado')
  })

  test('exibe a tela inicial de mensagens e o atalho para adicionar amigo', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Inicio do Concord' }).click()

    await expect(page.getByRole('heading', { name: 'Amigos' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Todos/ })).toBeVisible()
    await page.getByRole('button', { name: /Solicitações/ }).click()
    await expect(page.getByText('Nenhum convite de servidor pendente.')).toBeVisible()
    await page.getByRole('button', { name: 'Amigos', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Enviar mensagem para Ari' })).toBeVisible()
    await page.getByRole('button', { name: 'Adicionar amigo' }).click()
    await expect(page.getByRole('heading', { name: 'Adicionar amigo' })).toBeVisible()
    await expect(page.getByLabel('Identificador')).toBeVisible()
    await page.getByRole('button', { name: 'Encontre ou comece uma conversa' }).click()
    await expect(page.getByRole('heading', { name: 'Pessoas em sintonia.' })).toBeVisible()
  })

  test('abre uma mensagem privada com um amigo', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Inicio do Concord' }).click()
    await page.getByRole('button', { name: 'Enviar mensagem para Ari' }).click()
    await expect(page.getByText('Este é o começo da sua conversa com @ari.')).toBeVisible()
    await page.getByLabel('Mensagem privada').fill('Sinal privado')
    await page.getByLabel('Mensagem privada').press('Enter')
    await expect(page.getByText('Sinal privado')).toBeVisible()
  })

  test('administra canais e preferências pela central de configurações', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Concord', exact: true }).click()
    await page.getByRole('button', { name: 'Abrir configurações' }).click()

    await expect(page.getByRole('heading', { name: 'Configurações.' })).toBeVisible()
    const settingsDialog = page.getByRole('dialog', { name: 'Configurações.' })
    await settingsDialog.getByRole('tab', { name: 'Meus servidores', exact: true }).click()
    await expect(settingsDialog.getByRole('heading', { name: 'Meus servidores' })).toBeVisible()
    await settingsDialog.getByRole('button', { name: 'Gerenciar' }).click()
    await expect(settingsDialog.getByRole('heading', { name: 'Informações do servidor' })).toBeVisible()
    await settingsDialog.getByRole('tab', { name: 'Aparência', exact: true }).click()
    await settingsDialog.getByRole('combobox', { name: 'Estilo' }).click()
    await page.getByRole('option', { name: 'Liquid Glass' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-style-theme', 'glass')

    await settingsDialog.getByRole('tab', { name: 'Canais' }).click()
    await settingsDialog.getByLabel('Nome do canal').fill('planejamento')
    await settingsDialog.getByRole('combobox', { name: 'Tipo' }).click()
    await page.getByRole('option', { name: 'Voz' }).click()
    await settingsDialog.getByRole('button', { name: 'Criar canal' }).click()
    await expect(settingsDialog.getByText('planejamento')).toBeVisible()

    await settingsDialog.getByRole('tab', { name: 'Notificações' }).click()
    await settingsDialog.getByLabel('Silenciar servidor').check()
    await expect(settingsDialog.getByText('Servidor silenciado.')).toBeVisible()
    await settingsDialog.getByRole('button', { name: 'Fechar configurações' }).click()
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
    await page.getByRole('button', { name: 'Trocar servidor' }).click()
    await page.getByRole('menuitem', { name: 'Concord' }).click()
    await page.getByRole('button', { name: /Canais/ }).click()
    await expect(page.getByRole('button', { name: 'Fechar canais' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'geral' })).toBeVisible()
  })

  test('permite trocar de servidor pela navegação móvel', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()

    await page.getByRole('button', { name: 'Trocar servidor' }).click()
    const servers = page.getByRole('menu')
    await expect(servers.getByRole('menuitem', { name: 'Concord' })).toBeVisible()
    await expect(servers.getByRole('menuitem', { name: 'Criar servidor' })).toBeVisible()
  })

  test('abre o convite acima dos canais no celular', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: 'Trocar servidor' }).click()
    await page.getByRole('menuitem', { name: 'Concord' }).click()
    await page.getByRole('button', { name: /Canais/ }).click()
    await page.getByRole('button', { name: 'Convidar amigos' }).click()

    const dialog = page.getByRole('dialog', { name: /Convidar/ })
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(250)
    const isOnTop = await dialog.evaluate((element) => {
      const box = element.getBoundingClientRect()
      return document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)?.closest('[role="dialog"]') === element
    })
    expect(isOnTop).toBeTruthy()
  })

  test('oferece o fluxo móvel de adicionar amigos por identificador', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração local' }).click()
    await page.getByRole('button', { name: /Mensagens/ }).click()
    await expect(page.getByRole('heading', { name: 'Amigos' })).toBeVisible()
    await page.getByRole('button', { name: 'Adicionar amigo' }).click()
    await expect(page.getByRole('heading', { name: 'Adicionar amigo' })).toBeVisible()
    await expect(page.getByPlaceholder('@identificador')).toBeVisible()
    await page.getByPlaceholder('@identificador').fill('@amiga')
    await expect(page.getByRole('button', { name: 'Enviar pedido' })).toBeEnabled()
  })

  test('expõe o manifesto para instalação como PWA', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest')
    const manifest = await page.request.get('/manifest.webmanifest')
    expect(manifest.ok()).toBeTruthy()
  })
})
