import { createReadStream, createWriteStream } from "fs";
import ora from "ora";
import { join } from "path";
import { createInterface } from "readline";

const __dirname = import.meta.dirname;
const pathBase = join(__dirname, "files");

const gtins = [];
let qtdLines = 0;
let productsIncluidos = 0;
const dateInit = new Date();

const escritor = createWriteStream(join(pathBase, "saida.txt"));
const spinner = ora("Iniciando o processamento...\n").start();

async function process(filename) {
  spinner.start("Iniciando leitura de: " + filename);
  let linhasAnalizadas = 0;
  let linhasIncluidas = 0;
  const filePath = join(pathBase, filename + ".csv");

  const leitor = createInterface({
    input: createReadStream(filePath),
    output: process.stdout,
    terminal: false,
  });

  for await (const linha of leitor) {
    qtdLines++;
    linhasAnalizadas++;
    spinner.text = `(${(new Date(new Date() - dateInit) / 1000).toFixed(
      0
    )}s) Processando ${filename}
    - ${linhasAnalizadas} produtos analisados
    - ${linhasIncluidas} produtos incluídos
---------------------------
${productsIncluidos} produtos incluidos
${qtdLines} produtos processados
`;

    const data = linha.split(";");
    const barcode = data[1];
    if (!gtins.includes(barcode)) {
      gtins.push(barcode);
      linhasIncluidas++;
      productsIncluidos++;
      escritor.write(linha + "\n");
    }
  }

  // Evento que será disparado quando a leitura do arquivo terminar
  spinner.succeed(`Em ${filename}:
    - ${linhasAnalizadas} foram analisadas
    - ${linhasIncluidas} foram incluidas

---------------------------
${productsIncluidos} produtos incluidos
${qtdLines} produtos processados
${(new Date(new Date() - dateInit) / 1000).toFixed(0)} segundos
    `);
}

const files = [
  "boaesperanca",
  "caeteacu",
  "costaazul",
  "felix",
  "ferreira",
  "gabylo",
  "mercadoandrea",
  "mercadogabriel",
  "nossacasa",
  "solange",
];

(async () => {
  for (const file of files) {
    await process(file);
  }
  escritor.end();
  console.log(
    `Concluída em ${new Date(new Date() - dateInit) / 1000} segundos`
  );
})();
