export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  purchased: boolean;
}

// Google API type extensions
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}