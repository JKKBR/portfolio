import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CenariLogCaseStudy } from "@/components/CenariLogCaseStudy";
import { DiagramGeneratorCaseStudy } from "@/components/DiagramGeneratorCaseStudy";
import { InventoryStoreCaseStudy } from "@/components/InventoryStoreCaseStudy";
import { LogiTrackCaseStudy } from "@/components/LogiTrackCaseStudy";
import { ProfessionalResumeCaseStudy } from "@/components/ProfessionalResumeCaseStudy";
import { ProjectJsonLd } from "@/components/ProjectJsonLd";
import { RoutePlannerCaseStudy } from "@/components/RoutePlannerCaseStudy";
import { SpreadsheetCaseStudy } from "@/components/SpreadsheetCaseStudy";
import { UsedProductPassportCaseStudy } from "@/components/UsedProductPassportCaseStudy";
import { getProjectBySlug, projects } from "@/data/projects";
import type { Project } from "@/types/project";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map(({ slug }) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projeto não encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = `https://ffssportfolio.vercel.app/projetos/${project.slug}`;

  return {
    title: project.title,
    description: project.description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "article",
      locale: "pt_BR",
      url,
      title: project.title,
      description: project.description,
      siteName: "Portfólio Fabio Santos",
    },

    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

function GenericProjectCaseStudy({
  project,
}: {
  project: Project;
}) {
  return (
    <>
      <section className="section section-alt">
        <div className="container case-grid">
          <article>
            <p className="eyebrow">Problema</p>

            <h2>O contexto</h2>

            <p>{project.problem}</p>
          </article>

          <article>
            <p className="eyebrow">Solução</p>

            <h2>A proposta</h2>

            <p>{project.solution}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container case-grid">
          <article>
            <p className="eyebrow">Meu papel</p>

            <h2>Responsabilidades</h2>

            <p>{project.role}</p>

            {project.aiUse && (
              <p className="callout">{project.aiUse}</p>
            )}
          </article>

          <article>
            <p className="eyebrow">Recursos</p>

            <h2>Principais entregas</h2>

            <ul className="feature-list">
              {project.resources.map((resource) => (
                <li key={resource}>{resource}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {project.nextSteps && project.nextSteps.length > 0 && (
        <section className="section section-alt">
          <div className="container narrow">
            <p className="eyebrow">Evolução</p>

            <h2>Próximas melhorias</h2>

            <ul className="feature-list">
              {project.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function ProjectCaseStudy({
  project,
}: {
  project: Project;
}) {
  switch (project.slug) {
    case "gerador-planilhas-ia":
      return <SpreadsheetCaseStudy />;

    case "passaporte-produto-usado":
      return <UsedProductPassportCaseStudy />;

    case "cenarilog-academy":
      return <CenariLogCaseStudy />;

    case "curriculo-ats":
      return <ProfessionalResumeCaseStudy />;

    case "logitrack":
      return <LogiTrackCaseStudy />;

    case "sistema-inventario":
      return <InventoryStoreCaseStudy />;

    case "gerador-diagramas":
      return <DiagramGeneratorCaseStudy />;

    case "rota-a-rota":
      return <RoutePlannerCaseStudy />;

    default:
      return <GenericProjectCaseStudy project={project} />;
  }
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectJsonLd project={project} />

      <header className="project-hero section">
        <div className="container narrow">
          <Link className="back-link" href="/projetos">
            <span aria-hidden="true">←</span> Voltar aos projetos
          </Link>

          <div className="project-meta">
            <span className="tag">{project.category}</span>

            <span className="status">{project.status}</span>
          </div>

          <h1>{project.title}</h1>

          <p>{project.description}</p>

          <ul
            className="tech-list"
            aria-label="Tecnologias utilizadas"
          >
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>

          {(project.liveUrl || project.githubUrl) && (
            <div className="button-row">
              {project.liveUrl && (
                <a
                  className="button primary"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acessar projeto
                </a>
              )}

              {project.githubUrl && (
                <a
                  className="button secondary"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver no GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <ProjectCaseStudy project={project} />
    </>
  );
}
