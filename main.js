// Configuração do Airtable
const AIRTABLE_CONFIG = {
    apiKey: 'SEU_API_KEY_AQUI',
    baseId: 'SEU_BASE_ID_AQUI',
    tableName: 'Agendamentos'
};

// Dados
const diasSemana = [
    { id: 1, nome: 'Segunda', data: '16/12/2024' },
    { id: 2, nome: 'Terça', data: '17/12/2024' },
    { id: 3, nome: 'Quarta', data: '18/12/2024' },
    { id: 4, nome: 'Quinta', data: '19/12/2024' },
    { id: 5, nome: 'Sexta', data: '20/12/2024' },
    { id: 6, nome: 'Sábado', data: '21/12/2024' }
];

const horarios = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00'
];

const servicos = [
    { id: 1, nome: 'Corte', preco: 'R$ 35,00', duracao: '30min' },
    { id: 2, nome: 'Corte + Barba', preco: 'R$ 55,00', duracao: '50min' },
    { id: 3, nome: 'Barba', preco: 'R$ 25,00', duracao: '20min' },
    { id: 4, nome: 'Sobrancelha', preco: 'R$ 15,00', duracao: '15min' },
    { id: 5, nome: 'Acabamento', preco: 'R$ 20,00', duracao: '20min' }
];

// Estado da aplicação
let state = {
    selectedDay: null,
    selectedTime: null,
    selectedService: null
};

// Navegação entre telas
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    // Carregar conteúdo da tela
    if (screenId === 'selectDay') {
        renderDays();
    } else if (screenId === 'selectTime') {
        renderTimes();
    } else if (screenId === 'selectService') {
        renderServices();
    } else if (screenId === 'confirmBooking') {
        renderSummary();
    }
}

// Renderizar dias
function renderDays() {
    const grid = document.getElementById('daysGrid');
    grid.innerHTML = '';
    
    diasSemana.forEach(dia => {
        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerHTML = `
            <div class="day-name">${dia.nome}</div>
            <div class="day-date">${dia.data}</div>
        `;
        card.onclick = () => selectDay(dia);
        grid.appendChild(card);
    });
}

// Selecionar dia
function selectDay(dia) {
    state.selectedDay = dia;
    goToScreen('selectTime');
}

// Renderizar horários
function renderTimes() {
    const info = document.getElementById('selectedDayInfo');
    info.textContent = `${state.selectedDay.nome}, ${state.selectedDay.data}`;
    
    const grid = document.getElementById('timesGrid');
    grid.innerHTML = '';
    
    horarios.forEach(horario => {
        const card = document.createElement('div');
        card.className = 'time-card';
        card.textContent = horario;
        card.onclick = () => selectTime(horario);
        grid.appendChild(card);
    });
}

// Selecionar horário
function selectTime(horario) {
    state.selectedTime = horario;
    goToScreen('selectService');
}

// Renderizar serviços
function renderServices() {
    const info = document.getElementById('selectedTimeInfo');
    info.textContent = `${state.selectedDay.nome}, ${state.selectedDay.data} às ${state.selectedTime}`;
    
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = '';
    
    servicos.forEach(servico => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-name">${servico.nome}</div>
            <div class="service-price">${servico.preco}</div>
            <div class="service-duration">${servico.duracao}</div>
        `;
        card.onclick = () => selectService(servico);
        grid.appendChild(card);
    });
}

// Selecionar serviço
function selectService(servico) {
    state.selectedService = servico;
    goToScreen('confirmBooking');
}

// Renderizar resumo
function renderSummary() {
    const summary = document.getElementById('bookingSummary');
    summary.innerHTML = `
        <p><span class="label">Dia:</span> ${state.selectedDay.nome}, ${state.selectedDay.data}</p>
        <p><span class="label">Horário:</span> ${state.selectedTime}</p>
        <p><span class="label">Serviço:</span> ${state.selectedService.nome}</p>
        <p><span class="label">Valor:</span> ${state.selectedService.preco}</p>
        <p><span class="label">Duração:</span> ${state.selectedService.duracao}</p>
    `;
}

// Confirmar agendamento
async function confirmarAgendamento() {
    const nome = document.getElementById('customerName').value;
    const telefone = document.getElementById('customerPhone').value;
    
    if (!nome || !telefone) {
        alert('Por favor, preencha seu nome e telefone');
        return;
    }
    
    const btnConfirm = document.getElementById('btnConfirm');
    btnConfirm.disabled = true;
    btnConfirm.textContent = 'Agendando...';
    
    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        'Nome': nome,
                        'Telefone': telefone,
                        'Dia': state.selectedDay.nome,
                        'Data': state.selectedDay.data,
                        'Horario': state.selectedTime,
                        'Servico': state.selectedService.nome,
                        'Preco': state.selectedService.preco,
                        'Status': 'Confirmado'
                    }
                })
            }
        );
        
        if (response.ok) {
            document.getElementById('bookingForm').style.display = 'none';
            document.getElementById('successMessage').classList.remove('hidden');
            
            setTimeout(() => {
                resetApp();
            }, 3000);
        } else {
            alert('Erro ao agendar. Tente novamente.');
            btnConfirm.disabled = false;
            btnConfirm.textContent = 'Confirmar Agendamento';
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
        btnConfirm.disabled = false;
        btnConfirm.textContent = 'Confirmar Agendamento';
    }
}

// Resetar aplicação
function resetApp() {
    state = {
        selectedDay: null,
        selectedTime: null,
        selectedService: null
    };
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('btnConfirm').disabled = false;
    document.getElementById('btnConfirm').textContent = 'Confirmar Agendamento';
    goToScreen('homeScreen');
}

// Inicializar
goToScreen('homeScreen');