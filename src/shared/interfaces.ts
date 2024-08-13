
export interface Assistencia {
    nome: string,
		inicioExpediente: string ,
		fimExpediente: string,
		id: number
  }
  export interface GetAssistenciaByIdAndData {
		data: string,
		id: number
  }
  export interface Clientes {
    nome: string, 
    cpf: string   
  }
  export interface Agendamento {
    idAgendamento: number
    cliente: {
      cpf: string
      nome: string
    }
    assistencia: {
      nome: string
      inicioExpediente: string
      fimExpediente: string
      id: number
    }
    horario: string
    equipamento: string
  }
  export interface PostCliente {
    nome: string
    cpf: string
  }

  export interface PostAssistencia {
    nome: string
    inicioExpediente: string
    fimExpediente: string
  }

  export interface PostAgendamento {    
      cliente: {
        cpf: string
      }
      assistencia: {
        id: number
      }
      horario: string
      equipamento: string    
  }

  export interface HorarioOption {
    value: string;
    label: string;
  }

