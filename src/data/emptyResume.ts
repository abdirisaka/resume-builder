import { ResumeData } from '@/types/resume';

export const emptyResume: ResumeData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
};

export const sampleResume: ResumeData = {
  personal: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+44 7700 900123',
    location: 'London, UK',
    website: 'alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
  },
  summary:
    'Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, developer experience, and delivering products that users love. Proven track record of leading cross-functional teams and shipping features on time.',
  experience: [
    {
      id: '1',
      company: 'Acme Corp',
      title: 'Senior Software Engineer',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: [
        'Led architecture of a microservices migration that reduced deployment time by 40%.',
        'Mentored a team of 4 junior engineers through code reviews and weekly 1:1s.',
        'Introduced TypeScript across 3 core services, reducing runtime errors by 60%.',
      ],
    },
    {
      id: '2',
      company: 'Startup Ltd',
      title: 'Software Engineer',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      description: [
        'Built the company\'s core React dashboard from scratch, used by 10,000+ daily active users.',
        'Integrated Stripe payments, increasing conversion rate by 15%.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of Birmingham',
      degree: 'MSc',
      field: 'Computer Science',
      startDate: '2017-09',
      endDate: '2019-06',
      current: false,
      gpa: 'Distinction',
    },
  ],
  skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
};
