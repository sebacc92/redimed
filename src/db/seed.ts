/**
 * Seed script — run with: npx drizzle-kit push && npx tsx src/db/seed.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { db } from "./client";
import { users, siteSettings, services } from "./schema";
import { hashSync } from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // ─── Admin user ────────────────────────────────────────────────
  await db
    .insert(users)
    .values({
      email: "admin@redimed.com.ar",
      passwordHash: hashSync("admin123", 10),
      name: "Administrador",
    })
    .onConflictDoNothing();

  // ─── Site settings ─────────────────────────────────────────────
  const defaultSettings = [
    { key: "site_phone", value: "+54 11 1234-5678" },
    { key: "site_whatsapp", value: "5491112345678" },
    { key: "site_email", value: "info@redimed.com.ar" },
    { key: "site_address", value: "Buenos Aires, Argentina" },
    { key: "site_maps_url", value: "https://maps.app.goo.gl/example" },
    { key: "site_facebook", value: "https://facebook.com/redimed" },
    { key: "site_instagram", value: "https://instagram.com/redimed" },
    { key: "site_linkedin", value: "https://linkedin.com/company/redimed" },
    {
      key: "hero_title",
      value: "Internación Domiciliaria Integral",
    },
    {
      key: "hero_subtitle",
      value:
        "Más de 15 años brindando atención médica de calidad en la comodidad de tu hogar. Profesionales comprometidos con tu bienestar las 24 horas.",
    },
    { key: "services_title", value: "Atención integral a domicilio" },
    { key: "services_subtitle", value: "Brindamos una amplia gama de servicios médicos y de cuidado personalizado en la comodidad de tu hogar." },
    { key: "about_title", value: "Más de 15 años cuidando la salud en tu hogar" },
    { key: "about_text_1", value: "En Redimed somos especialistas en internación domiciliaria integral. Nuestro objetivo es brindar atención médica de excelencia en el hogar, permitiendo que el paciente se recupere en un entorno familiar y contenedor." },
    { key: "about_text_2", value: "Trabajamos con todas las obras sociales y prepagas del país, garantizando acceso universal a nuestros servicios de salud domiciliaria." },
    { key: "about_val1_title", value: "Compromiso" },
    { key: "about_val1_desc", value: "Nos comprometemos con cada paciente y su familia, brindando atención personalizada y seguimiento continuo." },
    { key: "about_val2_title", value: "Profesionalismo" },
    { key: "about_val2_desc", value: "Nuestro equipo está formado por profesionales de la salud altamente capacitados y con amplia experiencia." },
    { key: "about_val3_title", value: "Respeto" },
    { key: "about_val3_desc", value: "Respetamos la dignidad del paciente, su entorno familiar y sus necesidades individuales en todo momento." },
    { key: "contact_title", value: "¿Necesitás atención domiciliaria?" },
    { key: "contact_subtitle", value: "Completá el formulario y nos pondremos en contacto a la brevedad, o llamanos directamente." },
  ];

  for (const setting of defaultSettings) {
    await db.insert(siteSettings).values(setting).onConflictDoNothing();
  }

  // ─── Default services ──────────────────────────────────────────
  const defaultServices = [
    {
      title: "Internación Domiciliaria",
      description:
        "Atención médica integral en el hogar del paciente, con seguimiento profesional las 24 horas y equipamiento de última generación.",
      iconName: "bed",
      order: 1,
    },
    {
      title: "Recursos Técnicos",
      description:
        "Provisión de equipamiento médico especializado: oxigenoterapia, ARM, aspiradores, bombas de infusión y más.",
      iconName: "monitor-check",
      order: 2,
    },
    {
      title: "Enfermería",
      description:
        "Personal de enfermería altamente capacitado para cuidados generales, curaciones, administración de medicamentos y controles.",
      iconName: "stethoscope",
      order: 3,
    },
    {
      title: "Kinesiología",
      description:
        "Rehabilitación motora y respiratoria a domicilio, con planes de tratamiento personalizados para cada paciente.",
      iconName: "activity",
      order: 4,
    },
    {
      title: "Fonoaudiología",
      description:
        "Evaluación y tratamiento de trastornos del habla, la deglución y la comunicación en el entorno del paciente.",
      iconName: "mic",
      order: 5,
    },
    {
      title: "Cuidadores Domiciliarios",
      description:
        "Acompañantes terapéuticos y asistentes capacitados para el cuidado diario y la contención del paciente y su familia.",
      iconName: "hand-heart",
      order: 6,
    },
  ];

  for (const service of defaultServices) {
    await db.insert(services).values(service).onConflictDoNothing();
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
