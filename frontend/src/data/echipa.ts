// Conținutul paginii Echipă — transcris VERBATIM din content/pages/echipa.md (2026-09-20).
import type { ImageMetadata } from 'astro';

import athena from '../assets/team/athena-gandila.jpg';
import andrei from '../assets/team/andrei-rusu.jpg';
import delia from '../assets/team/delia-virga.jpg';
import bogdan from '../assets/team/bogdan-tulbure.jpg';
import ioana from '../assets/team/ioana-podina.jpg';
import shannon from '../assets/team/shannon-sauer-zavala.jpg';
import gianina from '../assets/team/gianina-buruczky.jpg';
import daniel from '../assets/team/daniel-dragulescu.jpg';
import gabriela from '../assets/team/gabriela-micu.jpg';
import vlad from '../assets/team/vlad-cosa.jpg';

export type Membru = {
  name: string;
  /** rând suplimentar sub nume (doar la Gianina Buruczky în original) */
  role?: string;
  photo: ImageMetadata;
};

export const despreNoi = {
  title: 'Despre noi',
  paragraphs: [
    'Acest studiu este realizat de o echipă de cercetare cu experiență în domeniul psihologiei clinice, organizaționale și psihoterapie, cu sprijinul Universității de Vest din Timișoara.',
    'Activitatea echipei acoperă arii diverse, incluzând burnoutul și dezvoltarea de intervenții psihologice bazate pe dovezi științifice. În cadrul proiectului, membrii echipei contribuie din roluri complementare (coordonare științifică, metodologie, implementare și analiză), asigurând respectarea standardelor etice și științifice în toate etapele studiului.',
    'Psihoterapeuții care implementează programul au fost instruiți în prealabil privind componentele intervenției și beneficiază de supervizare pe parcursul derulării acesteia.',
  ],
} as const;

export const echipaCercetare = {
  id: 'echipa-de-cercetare',
  title: 'Echipa de cercetare',
  members: [
    { name: 'Drd. Athena Gândilă', photo: athena },
    { name: 'Conf. Univ. Dr. Andrei Rusu', photo: andrei },
    { name: 'Prof. Univ. Dr. Delia Vîrgă', photo: delia },
    { name: 'Conf. Univ. Dr. Bogdan Tulbure', photo: bogdan },
    { name: 'Prof. Univ. Dr. Ioana Podină', photo: ioana },
    { name: 'Prof. Dr. Shannon Sauer-Zavala', photo: shannon },
    { name: 'Gianina Buruczky', role: 'Asistent cercetare voluntar', photo: gianina },
  ] satisfies readonly Membru[],
} as const;

export const echipaPsihoterapeuti = {
  id: 'echipa-de-psihoterapeuti',
  title: 'Echipa de psihoterapeuți',
  members: [
    { name: 'Psih. Daniel Drăgulescu', photo: daniel },
    { name: 'Psih. Gabriela Micu', photo: gabriela },
    { name: 'Psih. Vlad Coșa', photo: vlad },
  ] satisfies readonly Membru[],
} as const;
