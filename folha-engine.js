// folha-engine.js - Motor de Renderização Blindado
export const FolhaEngine = {
    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        for(let i=1; i<=180; i++) {
            if(i === 1 || i === 51) {
                const h = document.createElement('div');
                h.style.cssText = "background:#1e293b; color:#fbbf24; padding:8px; text-align:center; font-size:0.7rem; font-weight:bold; text-transform:uppercase;";
                h.innerText = i === 1 ? 'CADERNO DE RESPOSTAS - PEÇA' : 'CADERNO DE RESPOSTAS - QUESTÕES';
                container.appendChild(h);
            }
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `
                <div class="linha-num" title="Duplo clique para marcar" 
                     ondblclick="this.parentElement.style.background = this.parentElement.style.background === 'rgba(251, 191, 36, 0.2)' ? 'transparent' : 'rgba(251, 191, 36, 0.2)'">
                    ${i}
                </div>
                <input class="linha-folha" id="L${i}" maxlength="${limite}" spellcheck="false" autocomplete="off">
            `;
            container.appendChild(row);

            // Validação visual de caracteres
            const input = row.querySelector('input');
            input.addEventListener('input', () => {
                const count = input.value.length;
                if (count >= 80) input.style.color = "#f87171";
                else if (count >= 70) input.style.color = "#fbbf24";
                else input.style.color = "var(--text-color)";
            });
        }
    }
};
