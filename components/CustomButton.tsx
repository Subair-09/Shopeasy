import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Colors from '../constants/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'yellow' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'yellow':
        return styles.yellowContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'yellow':
        return styles.yellowText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.sizeSmall;
      case 'medium':
        return styles.sizeMedium;
      case 'large':
      default:
        return styles.sizeLarge;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'medium':
        return styles.textMedium;
      case 'large':
      default:
        return styles.textLarge;
    }
  };

  const indicatorColor =
    variant === 'yellow'
      ? Colors.primaryText
      : variant === 'outline' || variant === 'ghost'
      ? Colors.primary
      : Colors.white;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseContainer,
        getSizeStyle(),
        getContainerStyle(),
        (disabled || loading) && styles.disabledContainer,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[styles.baseText, getTextSizeStyle(), getTextStyle(), textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  sizeSmall: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sizeMedium: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  sizeLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 18,
    width: '100%',
  },
  baseText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 13,
  },
  textMedium: {
    fontSize: 15,
  },
  textLarge: {
    fontSize: 16,
  },
  primaryContainer: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryContainer: {
    backgroundColor: Colors.lightPurple,
  },
  secondaryText: {
    color: Colors.primary,
  },
  yellowContainer: {
    backgroundColor: Colors.accentYellow,
    shadowColor: '#C49500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  yellowText: {
    color: '#281B9B',
    fontWeight: '800',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  outlineText: {
    color: Colors.primaryText,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerContainer: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  dangerText: {
    color: Colors.error,
  },
  disabledContainer: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
});
