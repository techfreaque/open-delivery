import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, Truck } from 'lucide-react-native';
import Logo from '../branding/Logo';
import AddressSelector from '../address/AddressSelector';
import CartButton from '../cart/CartButton';
import NavLinks from './NavLinks';
import { UserType } from '../../types';
import { useUserType } from '../../lib/context/UserTypeContext';

type DesktopHeaderProps = {
  currentAddress: string;
  onAddressChange: (address: string) => void;
  cartItemCount?: number;
};

export default function DesktopHeader({ 
  currentAddress, 
  onAddressChange, 
  cartItemCount = 0 
}: DesktopHeaderProps) {
  const router = useRouter();
  const { userType } = useUserType();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.logoContainer}
          onPress={() => handleNavigate('/')}
        >
          <Logo height={40} width={120} />
        </TouchableOpacity>
        
        <AddressSelector
          currentAddress={currentAddress}
          onSelectAddress={onAddressChange}
          compact={true}
          showLabel={false}
        />
        
        <NavLinks userType={userType} handleNavigate={handleNavigate} />
        
        {userType === 'customer' && (
          <CartButton count={cartItemCount} onPress={() => handleNavigate('/cart')} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  logoContainer: {
    marginRight: 24,
  }
});
