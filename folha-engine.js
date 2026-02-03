// FolhaEngine.js - VERSÃO LIBERADA ABNT [2026-02-02]
export const FolhaEngine = {
    LIMITE_OAB: 60, 

    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper { 
                    background: #fff; 
                    border-bottom: 1px solid #d1d5db; 
                    display: flex; 
                    height: 32px; /* Altura padrão ABNT/FGV */
                    position: relative; 
                }
                /* Margem Direita (Linha Vermelha de limite) */
                .linha-wrapper::after { 
                    content: ""; 
                    position: absolute; 
                    right: 80px; 
                    top: 0; 
                    bottom: 0; 
                    width: 1px; 
                    background: rgba(239, 68, 68, 0.4); 
                    pointer-events: none; 
                }
                .linha-num { 
                    width: 45px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 0.8rem; 
                    color: #64748b; 
                    border-right: 2px solid #cbd5e1; 
                    background: #f1f5f9; 
                    user-select: none; 
                    font-weight: bold;
                }
                .linha-folha { 
                    flex: 1; 
                    border: none; 
                    outline: none; 
                    padding: 0 15px; 
                    font-size: 18px !important; 
                    font-family: 'Courier New', Courier, monospace !important; 
                    font-weight: 600 !important; 
                    color: #1a1a1a !important; 
                    background: transparent;
                    line-height: 32px;
                }
                .linha-folha:focus { background: #fffdeb; }
            `;
            document.head.appendChild(style);
        }

        // Criando as 150 linhas
        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `
                <div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" spellcheck="false" autocomplete="off" data-index="${i}">
            `;
            container.appendChild(row);

            const input = row.querySelector('input');

            // NAVEGAÇÃO FLUIDA
            input.addEventListener('keydown', (e) => {
                const idx = parseInt(input.getAttribute('data-index'));
                const proximo = document.getElementById(`L${idx + 1}`);
                const anterior = document.getElementById(`L${idx - 1}`);

                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }

                if (e.key === 'Backspace' && input.value === '') {
                    if (anterior) {
                        e.preventDefault();
                        anterior.focus();
                        // Move cursor para o final da linha anterior
                        const len = anterior.value.length;
                        anterior.setSelectionRange(len, len);
                    }
                }

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (anterior) anterior.focus();
                }

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }
            });
        }
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        if (!textoBruto) return;
        let currentLinha = linhaInicial;
        
        // Limpeza e Formatação básica
        const textoProcessado = textoBruto
            .replace(/<[^>]*>?/gm, '') // Remove HTML
            .split('\n');

        textoProcessado.forEach(paragrafo => {
            let palavras = paragrafo.split(' ');
            let acumulador = "";

            palavras.forEach(p => {
                // Se a palavra for muito longa ou o acumulador encher
                if ((acumulador + p).length > 75) { 
                    const el = document.getElementById(`L${currentLinha}`);
                    if (el) el.value = acumulador.trim();
                    currentLinha++;
                    acumulador = p + " ";
                } else {
                    acumulador += p + " ";
                }
            });

            // Salva o resto do parágrafo
            const elFinal = document.getElementById(`L${currentLinha}`);
            if (elFinal) elFinal.value = acumulador.trim();
            currentLinha++;
        });
    }
};
