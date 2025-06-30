# Site Institucional - LOGDI Transportes

Este é o código-fonte do site institucional da LOGDI, uma empresa de transportes e logística. O site foi desenvolvido para ser uma presença online moderna e informativa, apresentando os serviços, a área de atuação e as informações de contato da empresa.

## ✨ Funcionalidades

O site possui diversas funcionalidades para proporcionar uma experiência de usuário rica e interativa:

* **Design Responsivo:** Totalmente adaptado para funcionar em desktops, tablets e smartphones.
* **Mapa de Atuação Interativo:** Um mapa do Brasil em SVG é carregado dinamicamente, permitindo que os usuários cliquem ou selecionem um estado para ver os prazos de entrega detalhados para capital e interior.
* **Animações Dinâmicas:** Utiliza a biblioteca Animate on Scroll (AOS) para animar elementos conforme o usuário rola a página, tornando a navegação mais fluida e interessante.
* **Contadores Animados:** Números que representam a experiência da empresa (como anos de mercado e clientes atendidos) são animados de zero até o valor final quando se tornam visíveis.
* **Formulário de Contato Funcional:** Um formulário de contato completo com validação de campos em tempo real e um feedback visual de envio. (Obs: O envio é simulado no frontend e precisa ser integrado a um backend).
* **Carrossel de Imagens:** Seções específicas, como a de logística, contam com carrosséis de imagens automáticos e com navegação manual para exibir a estrutura da empresa.
* **Navegação Inteligente:**
    * O cabeçalho fica oculto ao rolar a página para baixo e reaparece ao rolar para cima ou mover o mouse para o topo.
    * Links do menu com rolagem suave para as seções correspondentes.
    * Um botão "Voltar ao Topo" aparece para facilitar a navegação.
* **Pré-carregador (Preloader):** Uma animação de carregamento é exibida enquanto o site carrega seus recursos, melhorando a percepção de desempenho.

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * HTML5
    * CSS3 (com Variáveis CSS para fácil customização de tema)
    * JavaScript (ES6+)
    * [Bootstrap 5](https://getbootstrap.com/): Framework para a estrutura de layout e componentes responsivos.
    * [Font Awesome](https://fontawesome.com/): Biblioteca de ícones.
    * [AOS (Animate on Scroll)](https://michalsnik.github.io/aos/): Biblioteca para animações de rolagem.
* **Servidor de Desenvolvimento:**
    * Node.js: Utilizado para criar um servidor local simples que serve os arquivos do site.

## 📁 Estrutura de Arquivos

```
sitelogdi/
│
├── index.html          # Arquivo principal com toda a estrutura do site.
├── style.css           # Folha de estilos principal, com toda a estilização.
├── script.js           # Arquivo JavaScript com todas as funcionalidades e interatividade.
├── server.js           # Servidor Node.js para rodar o projeto localmente.
│
├── imgs/               # Pasta com todas as imagens, ícones e logos.
│   ├── ...
│
└── mapa-brasil.svg     # Arquivo SVG do mapa do Brasil usado na seção "Área de Atuação".
```

## 🚀 Como Executar Localmente

Para visualizar e trabalhar no projeto em sua máquina local, você precisará ter o [Node.js](https://nodejs.org/) instalado.

1.  **Clone ou baixe este repositório:**
    * Faça o download dos arquivos e extraia-os em uma pasta de sua preferência.

2.  **Abra o terminal na pasta do projeto:**
    * Navegue até o diretório onde você extraiu os arquivos (a pasta `sitelogdi`).

3.  **Inicie o servidor local:**
    ```bash
    node server.js
    ```

4.  **Acesse o site no seu navegador:**
    * O terminal exibirá uma mensagem indicando que o servidor está rodando. Abra seu navegador e acesse [http://localhost:8000](http://localhost:8000).

## 🔧 Customização

A maior parte do conteúdo e das funcionalidades pode ser customizada diretamente nos arquivos de código.

* **Informações de Entrega (Prazos e Estados):**
    * Para alterar os estados atendidos e os prazos de entrega, modifique os objetos `estadosComEntrega` e `prazoEntrega` no início do arquivo `script.js`.

* **Informações das Bases (Endereços, Fotos):**
    * O conteúdo das bases (endereço, telefone, imagem, mapa) está diretamente no `index.html`, na seção `id="area-atuacao"`. Basta alterar os textos e os links das imagens e iframes do Google Maps.

* **Textos e Imagens:**
    * Todo o conteúdo textual (títulos, parágrafos) e as imagens podem ser alterados diretamente no arquivo `index.html`.

* **Cores e Fontes:**
    * As cores primárias, secundárias, de texto e fontes estão definidas como variáveis CSS no topo do arquivo `style.css`, dentro do seletor `:root`. Alterar esses valores mudará o tema do site inteiro.

* **Formulário de Contato:**
    * A lógica de envio no `script.js` é uma simulação (`setTimeout`). Para um funcionamento real, é necessário substituir o trecho de simulação por uma chamada a um serviço de backend ou API de envio de e-mails (como Formspree, Netlify Forms, ou um endpoint próprio).
