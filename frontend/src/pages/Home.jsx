import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderWizard from '../components/OrderWizard';

const marketingMessages = [
  'Planos personalizados para cada disciplina e nível académico.',
  'Atendimento 7 dias por semana com consultores reais.',
  'Pagamentos flexíveis via Mpesa e Emola com comprovativo integrado.',
];

const testimonials = [
  {
    name: 'Ana M.',
    role: 'Estudante de Direito',
    quote:
      'Em menos de 48 horas recebi um plano completo para o meu relatório. A equipa manteve-me actualizada e entregou muito antes do prazo.',
  },
  {
    name: 'Carlos T.',
    role: 'Mestrando em Engenharia',
    quote:
      'O consultor partilhou referências actuais e ajudou-me a estruturar o projecto final. Excelente qualidade e comunicação.',
  },
  {
    name: 'Inês L.',
    role: 'Investigadora',
    quote:
      'Os revisores melhoraram o texto científico e apresentaram gráficos prontos para publicação. Serviço impecável!',
  },
];

const services = [
  {
    title: 'Trabalhos Académicos',
    description: 'Ensaios, relatórios, fichas de leitura e resumos com revisão linguística e referências no formato solicitado.',
    icon: '📚',
  },
  {
    title: 'Projectos de Investigação',
    description: 'Planos de pesquisa, revisão bibliográfica e análise de dados com consultoria metodológica.',
    icon: '🧪',
  },
  {
    title: 'Apresentações Profissionais',
    description: 'Slides, infográficos e guiões de apresentação com design premium e storytelling persuasivo.',
    icon: '🎤',
  },
];

const stats = [
  { label: 'Projetos Entregues', value: 1800 },
  { label: 'Clientes Satisfeitos', value: 980 },
  { label: 'Consultores Especializados', value: 75 },
];

const steps = [
  {
    title: 'Submeta o Pedido',
    description: 'Descreva o que precisa, carregue materiais e escolha o prazo ideal para si.',
  },
  {
    title: 'Receba o Plano Personalizado',
    description: 'Combinamos o projecto com o consultor certo e partilhamos marcos de entrega para aprovação.',
  },
  {
    title: 'Acompanhe e Aprove',
    description: 'Siga o progresso em tempo real, envie feedback e obtenha a versão final pronta a apresentar.',
  },
];

export default function Home() {
  const [activeMessage, setActiveMessage] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counterValues, setCounterValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % marketingMessages.length);
    }, 4200);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const formattedStats = useMemo(() => stats.map((stat) => stat.value), []);

  useEffect(() => {
    let animationFrame;
    const start = performance.now();
    const duration = 1600;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounterValues(
        formattedStats.map((target) => Math.round(target * progress)),
      );
      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [formattedStats]);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-indigo-600 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Equipa dedicada à excelência académica
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Encomende trabalhos académicos com acompanhamento premium
            </h1>
            <div className="text-base md:text-lg text-white/90">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeMessage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
                >
                  {marketingMessages[activeMessage]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#order"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-gray-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Encomendar agora
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Ver como funciona
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐️⭐️⭐️⭐️⭐️</span>
                <span>Classificação média 4.9/5 (últimos 12 meses)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Feedback em menos de 30 minutos
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -right-8 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid gap-4">
              {services.map((service) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 shadow-lg backdrop-blur"
                >
                  <div className="text-3xl">{service.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                    <p className="text-sm text-white/80">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-6 text-center shadow-lg ring-1 ring-black/5"
            >
              <div className="text-4xl font-bold text-brand">
                {counterValues[index].toLocaleString('pt-PT')}
                <span className="text-2xl text-brand/60">+</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Como garantimos resultados em cada etapa</h2>
              <p className="mt-2 text-gray-600">
                Automatizamos o que é repetitivo e dedicamos tempo ao que exige pensamento crítico.
                Cada pedido tem um gestor de projecto responsável pelo acompanhamento.
              </p>
            </div>
            <a
              href="#order"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand/90"
            >
              Iniciar pedido
            </a>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="group relative rounded-2xl border border-gray-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-gray-900 shadow">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5">
            <h2 className="text-2xl font-bold text-gray-900">Planos e pacotes flexíveis</h2>
            <p className="mt-3 text-gray-600">
              Combine serviços de escrita, revisão, apresentação e formatação num único pedido. As equipas multidisciplinares asseguram qualidade consistente em cada entrega.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {services.map((service) => (
                <div key={`marketing-${service.title}`} className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="text-2xl">{service.icon}</div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-brand/5 p-8 shadow-inner ring-1 ring-brand/10">
              <h3 className="text-xl font-semibold text-brand">Garantia de Confiança</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-brand">✓</span>
                  Pagamentos seguros com recibo imediato e actualizações automáticas de estado.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-brand">✓</span>
                  Revisões ilimitadas até que o trabalho esteja conforme as normas solicitadas.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-brand">✓</span>
                  Equipa de qualidade monitoriza originalidade, formatação e referências.
                </li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-purple-700 p-8 text-white shadow-xl">
              <div className="absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <h3 className="text-xl font-semibold">Tem um prazo apertado?</h3>
              <p className="mt-2 text-sm text-white/80">
                Active o modo urgente e receba um plano detalhado com entregas parciais em até 24 horas.
              </p>
              <a
                href="#order"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg transition hover:shadow-xl"
              >
                Falar com um consultor
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] items-center">
          <div className="rounded-3xl bg-brand text-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold">Feedback real de estudantes e investigadores</h2>
            <p className="mt-3 text-sm text-white/80">
              Reunimos depoimentos verificados para mostrar como acompanhamos cada projecto do briefing à entrega final.
            </p>
            <div className="mt-6 flex gap-4 text-sm text-white/80">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3, 4].map((circle) => (
                  <span
                    key={circle}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xs font-semibold"
                  >
                    {circle + 1}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-semibold">4.9/5</p>
                <p>Classificação média em 2023</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[activeTestimonial].name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
              >
                <p className="text-lg font-medium text-gray-900">“{testimonials[activeTestimonial].quote}”</p>
                <div className="mt-6 text-sm text-gray-600">
                  <p className="font-semibold text-brand">{testimonials[activeTestimonial].name}</p>
                  <p>{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.name}
                    type="button"
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 w-6 rounded-full transition ${
                      activeTestimonial === index ? 'bg-brand' : 'bg-gray-200'
                    }`}
                    aria-label={`Mostrar testemunho de ${testimonial.name}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">Actualiza automaticamente</span>
            </div>
          </div>
        </div>
      </section>

      <section id="order" className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Vamos começar o seu pedido</h2>
            <p className="mt-2 text-sm text-gray-600">
              Conte-nos o que precisa e escolha os recursos adicionais de acordo com o objectivo académico.
            </p>
          </div>
          <OrderWizard />
        </div>
      </section>
    </div>
  );
}
