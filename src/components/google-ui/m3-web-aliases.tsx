'use client';

import React from 'react';
import {
  M3Button,
  M3ButtonProps,
  M3IconButton,
  M3IconButtonProps,
  M3FAB,
  M3BrandedFAB,
  M3SegmentedButton,
} from './m3-buttons';
import {
  M3AssistChip,
  M3FilterChip,
  M3InputChip,
  M3SuggestionChip,
  M3ChipSet,
  M3Badge,
} from './m3-chips-badges';
import {
  M3Card,
  M3CardProps,
  M3List,
  M3ListItem,
  M3Divider,
} from './m3-cards-lists-dividers';
import {
  M3NavigationBar,
  M3NavigationDrawer,
  M3Tabs,
} from './m3-navigation';
import {
  M3TextField,
  M3TextFieldProps,
  M3Checkbox,
  M3RadioGroup,
  M3Switch,
  M3Slider,
} from './m3-inputs-pickers';
import {
  M3LinearProgress,
  M3CircularProgress,
  M3Menu,
  M3Select,
  M3MenuProps,
} from './m3-overlays-feedback';
import { M3FocusRing, M3Elevation, M3StateLayer } from './m3-tokens';
import { GoogleDialog } from './GoogleGlobalUI';

/**
 * 1:1 Component Aliases matching Google's official @material/web repository:
 * https://github.com/material-components/material-web/blob/main/all.ts
 * + https://github.com/material-components/material-web/tree/main/labs
 */

// 1. Buttons (@material/web/button/*)
export const MdFilledButton = (props: Omit<M3ButtonProps, 'variant'>) => (
  <M3Button {...props} variant="filled" />
);
export const MdElevatedButton = (props: Omit<M3ButtonProps, 'variant'>) => (
  <M3Button {...props} variant="elevated" />
);
export const MdFilledTonalButton = (props: Omit<M3ButtonProps, 'variant'>) => (
  <M3Button {...props} variant="tonal" />
);
export const MdOutlinedButton = (props: Omit<M3ButtonProps, 'variant'>) => (
  <M3Button {...props} variant="outlined" />
);
export const MdTextButton = (props: Omit<M3ButtonProps, 'variant'>) => (
  <M3Button {...props} variant="text" />
);

// 2. Icon Buttons (@material/web/iconbutton/*)
export const MdIconButton = (props: Omit<M3IconButtonProps, 'variant'>) => (
  <M3IconButton {...props} variant="standard" />
);
export const MdFilledIconButton = (props: Omit<M3IconButtonProps, 'variant'>) => (
  <M3IconButton {...props} variant="filled" />
);
export const MdFilledTonalIconButton = (props: Omit<M3IconButtonProps, 'variant'>) => (
  <M3IconButton {...props} variant="tonal" />
);
export const MdOutlinedIconButton = (props: Omit<M3IconButtonProps, 'variant'>) => (
  <M3IconButton {...props} variant="outlined" />
);

// 3. FAB & Branded FAB (@material/web/fab/*)
export const MdFab = M3FAB;
export const MdBrandedFab = M3BrandedFAB;

// 4. Segmented Button (@material/web/labs/segmentedbuttonset/*)
export const MdOutlinedSegmentedButtonSet = M3SegmentedButton;

// 5. Chips (@material/web/chips/*)
export const MdChipSet = M3ChipSet;
export const MdAssistChip = M3AssistChip;
export const MdFilterChip = M3FilterChip;
export const MdInputChip = M3InputChip;
export const MdSuggestionChip = M3SuggestionChip;

// 6. Cards (@material/web/labs/card/*)
export const MdElevatedCard = (props: Omit<M3CardProps, 'variant'>) => (
  <M3Card {...props} variant="elevated" />
);
export const MdFilledCard = (props: Omit<M3CardProps, 'variant'>) => (
  <M3Card {...props} variant="filled" />
);
export const MdOutlinedCard = (props: Omit<M3CardProps, 'variant'>) => (
  <M3Card {...props} variant="outlined" />
);

// 7. Text Fields (@material/web/textfield/*)
export const MdFilledTextField = (props: Omit<M3TextFieldProps, 'variant'>) => (
  <M3TextField {...props} variant="filled" />
);
export const MdOutlinedTextField = (props: Omit<M3TextFieldProps, 'variant'>) => (
  <M3TextField {...props} variant="outlined" />
);

// 8. Select (@material/web/select/*)
export const MdFilledSelect = (props: Omit<M3MenuProps, 'variant' | 'fieldStyle'>) => (
  <M3Select {...props} variant="filled" />
);
export const MdOutlinedSelect = (props: Omit<M3MenuProps, 'variant' | 'fieldStyle'>) => (
  <M3Select {...props} variant="outlined" />
);

// 9. Selection & Inputs (@material/web/checkbox, radio, switch, slider)
export const MdCheckbox = M3Checkbox;
export const MdRadio = M3RadioGroup;
export const MdSwitch = M3Switch;
export const MdSlider = M3Slider;

// 10. Progress (@material/web/progress/*)
export const MdLinearProgress = M3LinearProgress;
export const MdCircularProgress = M3CircularProgress;

// 11. Lists, Menus, Dialogs, Dividers, Tabs, Badges, Foundations
export const MdList = M3List;
export const MdListItem = M3ListItem;
export const MdMenu = M3Menu;
export const MdDialog = GoogleDialog;
export const MdDivider = M3Divider;
export const MdTabs = M3Tabs;
export const MdBadge = M3Badge;
export const MdFocusRing = M3FocusRing;
export const MdElevation = M3Elevation;
export const MdRipple = M3StateLayer;
export const MdNavigationBar = M3NavigationBar;
export const MdNavigationDrawer = M3NavigationDrawer;
