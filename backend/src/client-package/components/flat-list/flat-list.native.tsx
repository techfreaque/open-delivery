import type { ElementRef, ReactElement } from "react";
import { forwardRef } from "react";
import {
  FlatList as RNFlatList,
  type FlatListProps as RNFlatListProps,
} from "react-native";

import { cn } from "@/next-portal/utils/utils";

import type { FlatListProps } from "./flat-list.types";

export interface NativeFlatListProps<T>
  extends Omit<RNFlatListProps<T>, "renderItem">,
    FlatListProps<T> {}

function FlatListComponent<T>(
  {
    data,
    renderItem,
    keyExtractor,
    horizontal,
    numColumns,
    className,
    style,
    showsHorizontalScrollIndicator,
    showsVerticalScrollIndicator,
    contentContainerStyle,
    ...props
  }: NativeFlatListProps<T>,
  ref: React.Ref<RNFlatList<T>>,
): ReactElement {
  return (
    <RNFlatList
      ref={ref as React.Ref<RNFlatList<T>>}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal={horizontal}
      numColumns={numColumns}
      className={cn(className)}
      style={style}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={contentContainerStyle}
      {...props}
    />
  );
}

export const FlatList = forwardRef(FlatListComponent) as <T>(
  props: NativeFlatListProps<T> & {
    ref?: React.Ref<RNFlatList<T>>;
  },
) => ReactElement;
