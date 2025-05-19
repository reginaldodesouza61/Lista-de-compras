import { Product } from '../types';

const SPREADSHEET_ID = '1oNB52jrAXnSaYb49ZHZ84dzl7H3N6MBJI9BYkD_JAHg';
const SHEET_NAME = 'Produtos';
const RANGE = 'A2:F';
const API_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

// Transforma uma linha da planilha em objeto Product
const rowToProduct = (row: string[]): Product => ({
  id: String(row[0]),
  name: row[1],
  quantity: parseInt(row[2], 10),
  unitPrice: parseFloat(row[3]),
  totalPrice: parseFloat(row[4]),
  purchased: row[5]?.toString().toLowerCase() === 'true',
});

// Transforma Product em array para enviar à planilha
function productToRow(product: Product): string[] {
  return [
    product.id,
    product.name,
    product.quantity.toString(),
    product.unitPrice.toString(),
    product.totalPrice.toString(),
    product.purchased.toString(),
  ];
}

// Buscar todos os produtos
export const getProducts = async (accessToken: string): Promise<Product[]> => {
  const res = await fetch(`${API_BASE}/values/${SHEET_NAME}!${RANGE}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  const rows = data.values || [];
  return rows.map(rowToProduct);
};

// Adicionar novo produto (apenas se ID não existir)
export const addProductToSheet = async (
  product: Omit<Product, 'id'>,
  accessToken: string
): Promise<Product> => {
  const id = Date.now().toString();
  const newProduct: Product = { ...product, id };

  // Buscar IDs existentes (inclui cabeçalho)
  const res = await fetch(`${API_BASE}/values/${SHEET_NAME}!A2:A`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  const idColumn = data.values || [];
  const alreadyExists = idColumn.some((row: string[]) => String(row[0]) === newProduct.id);

  if (alreadyExists) {
    throw new Error(`Produto com ID ${newProduct.id} já existe. Use updateProductInSheet em vez de add.`);
  }

  // Inserir nova linha
  await fetch(`${API_BASE}/values/${SHEET_NAME}!A:F:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [productToRow(newProduct)] }),
  });

  return newProduct;
};

// Atualizar produto existente com base no ID
export const updateProductInSheet = async (product: Product, accessToken: string): Promise<void> => {
  // Busca todos os IDs a partir da linha 2 (ignora cabeçalho)
  const res = await fetch(
    `${API_BASE}/values/${SHEET_NAME}!A2:A`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  const idColumn = data.values || [];
  // rowIndex agora corresponde à linha real (A2 = rowIndex 0)
  const rowIndex = idColumn.findIndex((row: string[]) => String(row[0]) === String(product.id));

  // LOG PARA DEPURAÇÃO
  console.log('ID procurado:', product.id);
  console.log('Coluna de IDs:', idColumn.map(r => r[0]));
  console.log('rowIndex encontrado:', rowIndex);

  if (rowIndex === -1) throw new Error('Product not found');

  // Atualiza a linha correta (linha na planilha = rowIndex + 2)
  await fetch(
    `${API_BASE}/values/${SHEET_NAME}!A${rowIndex + 2}:F${rowIndex + 2}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [productToRow(product)] }),
    }
  );
};

// Excluir produto com base no ID
export const deleteProductFromSheet = async (
  id: string,
  accessToken: string
): Promise<void> => {
  // Buscar todos os IDs a partir da linha 2 (ignora cabeçalho)
  const res = await fetch(
    `${API_BASE}/values/${SHEET_NAME}!A2:A`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  const idColumn = data.values || [];
  const rowIndex = idColumn.findIndex((row: string[]) => String(row[0]) === String(id));

  if (rowIndex === -1) throw new Error('Product not found');

  // Buscar o sheetId real
  const metaRes = await fetch(API_BASE, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const meta = await metaRes.json();
  const sheet = meta.sheets.find((s: any) => s.properties.title === SHEET_NAME);
  const sheetId = sheet.properties.sheetId;

  // Deletar a linha
  await fetch(`${API_BASE}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex + 1,
              endIndex: rowIndex + 2,
            },
          },
        },
      ],
    }),
  });
};