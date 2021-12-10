// Dependencies
import axios from 'axios'; // HTTP client
import cheerio from 'cheerio'; // jQuery implementation for Node.js
import fs from 'fs';

/**
 * Returns the data from an axios GET request.
 *
 * @param {string} url - The url to request.
 * @returns the data expected to be some HTML content
 * @author Joaquim Gregório <https://github.com/JoaquimGregorio>
 */
async function getData(url: string) {
  const { data } = await axios.get(url);
  return data;
}

/**
 * Returns the value of a href attribute from an anchor tag which is some url.
 *
 * @param data - Data is the html loaded from an axios request.
 * @param context - The context to find the anchor tags
 * @param pattern - Pattern maching to filter the url in the anchor tags
 * @returns {string} The url itself as a string
 * @author Joaquim Gregório <https://github.com/JoaquimGregorio>
 */
function getUrlFromAnchorTag(
  data: any,
  context: string,
  pattern: string
): string {
  const $ = cheerio.load(data);

  const pageContent = $('a', context);

  let url = '';
  pageContent.each((_index, element) => {
    let hrefValue = $(element).attr('href') ?? '';
    if (hrefValue.includes(pattern)) {
      url = hrefValue;
    }
  });
  return url;
}

/**
 * Download the padrao-tiss_componente-organizacional_*.pdf file.
 *
 * @param {string} url - Requested url do download the pdf.
 * @author Joaquim Gregório <https://github.com/JoaquimGregorio>
 */
async function downloadPdf(url: string) {
  try {
    let data = await getData(url);

    let pageUrl = getUrlFromAnchorTag(
      data,
      'div#content-core div#parent-fieldname-text',
      'padrao-tiss-2013'
    );

    if (!pageUrl) throw new Error('Failed to get the download page.');

    // Since here we are in the download page
    data = await getData(pageUrl);

    let fileUrl = getUrlFromAnchorTag(
      data,
      'div table tbody tr td',
      'padrao-tiss_componente-organizacional'
    );

    if (!fileUrl) throw new Error('Failed to get the file url.');

    // Getting the last array element which is the file name
    const fileName = fileUrl.split('/').at(-1) as string;

    // Creating a writable stream to pipe the data of the file
    const file = fs.createWriteStream(fileName); // Save in the root directory

    // Requesting the download
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream', // type for download request
    });

    // Saving the file
    response.data.pipe(file);

    console.log('File saved successfully!');
  } catch (err) {
    console.log(err);
  }
}

downloadPdf(
  'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss'
);
