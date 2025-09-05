import {CartItem} from '../../components/types/screenTypes/ScreenTypes';

interface ActionResult {
  success: boolean;
  error?: {
    title: string;
    message: string;
  };
}

export const getHexColor = (colorName: string) =>
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorName) ? colorName : '#808080';

export const createCartItem = (
  productData: any,
  productUuid: string | '',
  finalPrice: number,
  quantity: number,
  selectedColor: string | null,
  frontFile: any,
  backFile: any,
  reviewText: string,
  attributeValues: {[key: string]: string},
  selectedSize: string | null,
): CartItem => {
  return {
    id: productData.id,
    productUuid,
    name: productData.name || 'Unnamed Product',
    price: finalPrice,
    quantity: quantity || 1,
    selectedColor: selectedColor ? getHexColor(selectedColor) : undefined,
    frontFile: frontFile ? frontFile : undefined,
    backFile: backFile ? backFile : undefined,
    orderNotes: reviewText || undefined,
    attributes: {
      ...attributeValues,
      size: selectedSize || undefined,
    },
    deliveryPrice: productData?.shipping?.shipping_cost || 0,
  };
};

export const validateSelections = (
  colorOptions: string[],
  selectedColor: string | null,
  productData: any,
  selectedSize: string | null,
  frontFile: any,
  backFile: any,
): ActionResult => {
  if (colorOptions.length > 0 && !selectedColor) {
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'Please select a color before proceeding.',
      },
    };
  }
  if (
    productData?.size_variations &&
    productData.size_variations.length > 0 &&
    !selectedSize
  ) {
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'Please select a size before proceeding.',
      },
    };
  }
  if (!frontFile) {
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'Please upload a front image before proceeding.',
      },
    };
  }
  if (!backFile) {
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'Please upload a back image before proceeding.',
      },
    };
  }
  return {success: true};
};
