import React from 'react';
import { 
  PersonIcon, 
  LockClosedIcon, 
  ExitIcon, 
  PersonIcon as UserIcon,
  BookmarkIcon,
  GroupIcon,
  GearIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
  ClockIcon,
  Cross2Icon,
  CheckIcon,
  FileTextIcon,
  BarChartIcon,
  ReloadIcon
} from '@radix-ui/react-icons';

export const Icons = {
  User: PersonIcon,
  Lock: LockClosedIcon,
  LogOut: ExitIcon,
  UserCircle: UserIcon,
  BookOpen: BookmarkIcon,
  Users: GroupIcon,
  GraduationCap: GearIcon,
  Search: MagnifyingGlassIcon,
  Pencil: Pencil1Icon,
  Trash2: TrashIcon,
  Plus: PlusIcon,
  PlusCircle: PlusIcon,
  Clock: ClockIcon,
  X: Cross2Icon,
  Menu: GroupIcon,
  AlertCircle: CheckIcon,
  FileText: FileTextIcon,
  ChartBar: BarChartIcon,
  Upload: FileTextIcon,
  Loader: ReloadIcon
};

export type IconName = keyof typeof Icons;