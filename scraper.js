import axios from 'axios';
import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import fs from 'fs'; // Módulo nativo de Node.js para escribir archivos

async function scrapeWWE() {
  console.log("Iniciando scraping de eventos WWE...");
  
  try {
    // Simulamos el HTML que devolvería una web de wrestling
    const mockHTML = `
      <div class="evento">
        <h2 class="titulo">Money in the Bank</h2>
        <span class="fecha-eeuu">2026-07-05 19:00</span>
        <ul class="combates">
          <li>Cody Rhodes vs. Randy Orton - WWE Championship</li>
          <li>Damian Priest vs. Gunther - World Heavyweight Championship</li>
          <li>Men's Money in the Bank Ladder Match</li>
        </ul>
      </div>
      <div class="evento">
        <h2 class="titulo">SummerSlam</h2>
        <span class="fecha-eeuu">2026-08-02 19:00</span>
        <ul class="combates">
          <li>Cartelera por confirmar en televisión</li>
        </ul>
      </div>
    `;

    const $ = cheerio.load(mockHTML);
    const eventos = [];

    $('.evento').each((index, element) => {
      const titulo = $(element).find('.titulo').text().trim();
      const fechaEEUU = $(element).find('.fecha-eeuu').text().trim();
      
      const combates = [];
      $(element).find('.combates li').each((i, li) => {
        combates.push($(li).text().trim());
      });

      const fechaObjetoET = DateTime.fromFormat(fechaEEUU, "yyyy-MM-dd HH:mm", { zone: "America/New_York" });
      const fechaUTC = fechaObjetoET.toUTC().toISO();

      eventos.push({
        titulo,
        fechaUTC,
        // Imagen aleatoria de wrestling para que quede bonito en la web
        imagen: `https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=60&sig=${index}`,
        combates
      });
    });

    // --- LA MAGIA: Guardamos el archivo físico ---
    fs.writeFileSync('datos.json', JSON.stringify(eventos, null, 2));
    console.log("¡Archivo datos.json guardado con éxito!");
    
  } catch (error) {
    console.error("Error en el scraping:", error);
  }
}

scrapeWWE();
