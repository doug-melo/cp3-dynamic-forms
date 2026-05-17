import { FormConfig } from '../types/form';

export const formConfig: FormConfig = {
  title: 'Cadastro Profissional',
  fields: [
    {
      id: 'name',
      label: 'Nome completo',
      type: 'text',
      required: true,
      placeholder: 'Digite seu nome',
    },
    {
      id: 'email',
      label: 'E-mail',
      type: 'email',
      required: true,
      placeholder: 'nome@email.com',
    },
    {
      id: 'password',
      label: 'Senha',
      type: 'password',
      required: true,
      placeholder: 'Crie uma senha',
    },
    {
      id: 'experienceYears',
      label: 'Anos de experiencia',
      type: 'number',
      required: true,
      placeholder: '2',
    },
    {
      id: 'bio',
      label: 'Resumo profissional',
      type: 'textarea',
      required: true,
      placeholder: 'Conte um pouco sobre sua experiencia',
    },
    {
      id: 'gender',
      label: 'Genero',
      type: 'radio',
      required: true,
      options: [
        { label: 'Masculino', value: 'male' },
        { label: 'Feminino', value: 'female' },
        { label: 'Outro', value: 'other' },
      ],
    },
    {
      id: 'state',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { label: 'SP', value: 'SP' },
        { label: 'RJ', value: 'RJ' },
        { label: 'MG', value: 'MG' },
        { label: 'PR', value: 'PR' },
      ],
    },
    {
      id: 'area',
      label: 'Area de interesse',
      type: 'combo',
      required: true,
      options: [
        { label: 'Mobile', value: 'mobile' },
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Dados', value: 'data' },
      ],
    },
    {
      id: 'birthDate',
      label: 'Data de nascimento',
      type: 'date',
      required: true,
      placeholder: 'dd-mm-yyyy',
    },
    {
      id: 'terms',
      label: 'Aceito os termos de cadastro',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'notifications',
      label: 'Receber notificacoes',
      type: 'switch',
      required: false,
    },
  ],
};
