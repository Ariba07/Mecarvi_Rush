import React from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import OrderCard from './OrderCard';
import {Order, tabs} from './types';
import {styles} from '../../assets/styles/orders/OrderStyles';
import * as Animatable from 'react-native-animatable'; // Import animatable

interface OrderListProps {
  orders: Order[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  role: string | null;
  isFirstLoad: boolean;
  fetchOrdersError: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  isLoadingMore: boolean;
  loadMoreError: string | null;
  onLoadMore: () => void;
  onOpenOrderModal: (order: Order) => void;
  onOpenStatusModal: (orderUuid: string) => void;
  onOpenTrackingModal: (orderUuid: string) => void;
  onOpenCancelModal: (orderUuid: string) => void;
  onOpenDisputeModal: (orderId: number) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  selectedTab,
  setSelectedTab,
  role,
  isFirstLoad,
  fetchOrdersError,
  refreshing,
  onRefresh,
  isLoadingMore,
  loadMoreError,
  onLoadMore,
  onOpenOrderModal,
  onOpenStatusModal,
  onOpenTrackingModal,
  onOpenCancelModal,
  onOpenDisputeModal,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const filteredOrders =
    selectedTab === 'All'
      ? orders
      : orders.filter(
          ord => (ord.status || '').toLowerCase() === selectedTab.toLowerCase(),
        );

  return (
    <>
      <View
        style={[styles.tabWrapper, {backgroundColor: theme.backgroundColor}]}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.filter}
          contentContainerStyle={styles.tabContainer}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => setSelectedTab(item.filter)}
              style={[
                styles.tabButton,
                {backgroundColor: theme.whole},
                selectedTab === item.filter && styles.activeTabButton,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {color: theme.input},
                  selectedTab === item.filter && styles.activeTabText,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {isFirstLoad ? (
        <Animatable.View
          animation="bounceIn"
          duration={800}
          style={styles.noOrdersContainer}>
          <Text style={[styles.noOrdersText, {color: theme.text}]}>
            Loading orders...
          </Text>
        </Animatable.View>
      ) : fetchOrdersError ? (
        <Animatable.View
          animation="bounceIn"
          duration={800}
          style={styles.noOrdersContainer}>
          <Text style={[styles.noOrdersText, {color: theme.text}]}>
            No Orders
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </Animatable.View>
      ) : filteredOrders.length === 0 ? (
        <Animatable.View
          animation="bounceIn"
          duration={800}
          style={styles.noOrdersContainer}>
          <Text style={[styles.noOrdersText, {color: theme.text}]}>
            No such orders yet
          </Text>
        </Animatable.View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <OrderCard
              order={item}
              role={role}
              onOpenOrderModal={onOpenOrderModal}
              onOpenStatusModal={onOpenStatusModal}
              onOpenTrackingModal={onOpenTrackingModal}
              onOpenCancelModal={onOpenCancelModal}
              onOpenDisputeModal={onOpenDisputeModal}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#00A19D']}
              tintColor={'#00A19D'}
              title="Refreshing..."
              titleColor={theme.text}
            />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isLoadingMore ? (
              <Animatable.View
                animation="fadeIn"
                duration={600}
                style={styles.footerContainer}>
                <Text style={[styles.footerText, {color: theme.text}]}>
                  Loading more...
                </Text>
              </Animatable.View>
            ) : loadMoreError ? (
              <Animatable.View
                animation="fadeIn"
                duration={600}
                style={styles.footerContainer}>
                <Text style={[styles.footerText, {color: theme.text}]}>
                  No Orders
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={onLoadMore}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </Animatable.View>
            ) : null
          }
        />
      )}
    </>
  );
};

export default OrderList;
