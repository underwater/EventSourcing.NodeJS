import { Event, StreamEvent } from '#core/events';
import { ProductItem, addProductItem, removeProductItem } from './productItems';

export type ShoppingCartOpened = Event<
  'shopping-cart-opened',
  {
    shoppingCartId: string;
    clientId: string;
    openedAt: Date;
  }
>;

export type ProductItemAddedToShoppingCart = Event<
  'product-item-added-to-shopping-cart',
  {
    shoppingCartId: string;
    productItem: ProductItem;
  }
>;

export type ProductItemRemovedFromShoppingCart = Event<
  'product-item-removed-from-shopping-cart',
  {
    shoppingCartId: string;
    productItem: ProductItem;
  }
>;

export type ShoppingCartConfirmed = Event<
  'shopping-cart-confirmed',
  {
    shoppingCartId: string;
    confirmedAt: Date;
  }
>;

export type ShoppingCartEvent =
  | ShoppingCartOpened
  | ProductItemAddedToShoppingCart
  | ProductItemRemovedFromShoppingCart
  | ShoppingCartConfirmed;

export enum ShoppingCartStatus {
  Opened = 1 << 0,
  Confirmed = 1 << 1,
  Cancelled = 1 << 2,

  Closed = Confirmed | Cancelled,
}

export type ShoppingCart = Readonly<{
  id: string;
  clientId: string;
  status: ShoppingCartStatus;
  productItems: ProductItem[];
  openedAt: Date;
  confirmedAt?: Date;
}>;

export function getDefaultShoppingCart(): ShoppingCart {
  return <ShoppingCart>{};
}

export function getShoppingCartStreamName(shoppingCartId: string): string {
  return `shoppingCart-${shoppingCartId}`;
}

export function when(
  currentState: ShoppingCart,
  streamEvent: StreamEvent<ShoppingCartEvent>
): ShoppingCart {
  const { event } = streamEvent;
  switch (event.type) {
    case 'shopping-cart-opened':
      return {
        id: event.data.shoppingCartId,
        clientId: event.data.clientId,
        openedAt: event.data.openedAt,
        productItems: [],
        status: ShoppingCartStatus.Opened,
      };
    case 'product-item-added-to-shopping-cart':
      return {
        ...currentState,
        productItems: addProductItem(
          currentState.productItems,
          event.data.productItem
        ),
      };
    case 'product-item-removed-from-shopping-cart':
      return {
        ...currentState,
        productItems: removeProductItem(
          currentState.productItems,
          event.data.productItem
        ),
      };
    case 'shopping-cart-confirmed':
      return {
        ...currentState,
        status: ShoppingCartStatus.Confirmed,
        confirmedAt: event.data.confirmedAt,
      };
    default:
      // Unexpected event type
      return {
        ...currentState,
      };
  }
}

export type SHOPPING_CARD_CLOSED = 'SHOPPING_CARD_CLOSED';
export type SHIFT_DOES_NOT_EXIST = 'SHIFT_DOES_NOT_EXIST';
