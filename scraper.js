import axios from 'axios';
import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';

// Función para simular u obtener el HTML de la cartelera
async function scrapeWWE() {
  console.log("Iniciando scraping de eventos WWE...");
  
  try {
    // NOTA: En un caso real, aquí pondríamos la URL real (ej. wikipedia o una web de noticias)
    // URL de ejemplo: const { data } = await axios.get('https://ejemplo.com/wwe-schedule');
    
    // Simulamos el HTML que devolvería una tabla de eventos típica
    const mockHTML = `
      <div class="evento">
        <h2 class="titulo">Money in the Bank</h2>
        <span class="fecha-eeuu">2026-07-05 19:00</span> <ul class="combates">
          <li>Cody Rhodes vs. Randy Orton - WWE Championship</li>
          <li>Kevin Owens vs. Solo Sikoa</li>
        </ul>
      </div>
    `;

    const $ = cheerio.load(mockHTML);
    const eventos = [];

    $('.evento').each((index, element) => {
      const titulo = $(element).find('.titulo').text().trim();
      const fechaEEUU = $(element).find('.fecha-eeuu').text().trim(); // "2026-07-05 19:00"
      
      const combates = [];
      $(element).find('.combates li').each((i, li) => {
        combates.push($(li).text().trim());
      });

      // --- MAGIA HORARIA ---
      // 1. Interpretamos la hora original como hora de Nueva York (America/New_York)
      const fechaObjetoET = DateTime.fromFormat(fechaEEUU, "yyyy-MM-dd HH:mm", { zone: "America/New_York" });
      
      // 2. La convertimos a UTC para guardarla de forma limpia y estándar
      const fechaUTC = fechaObjetoET.toUTC().toISO();
      // 3. (Opcional para este log) Ver cómo se vería en España
      const fechaEspaña = fechaObjetoET.setZone("Europe/Madrid").toFormat("dd/MM/yyyy 'a las' HH:mm 'hora peninsular'");

      eventos.push({
        titulo,
        fechaUTC,
        fechaEspaña,
        combates
      });
    });

    console.log("¡Scraping completado con éxito! Datos procesados:");
    console.log(JSON.stringify(eventos, null, 2));

    // Aquí añadiríamos el código para enviar estos datos a tu base de datos (Supabase/Firebase)
    
  } catch (error) {
    console.error("Error en el scraping:", error);
  }
}

scrapeWWE();
