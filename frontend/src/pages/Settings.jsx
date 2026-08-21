import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Key,
  Bell,
  CreditCard,
  Globe,
  Save,
  Trash2,
  CheckCircle,
  Shield,
  Smartphone,
  Settings as SettingsIcon,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
const Settings = () => {
  const { user, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currency: user?.currency || 'NGN',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully! 🎉');
      // Update user in context
      // In production: await authAPI.updateProfile(profileForm)
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password updated successfully! 🔒');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      toast.error('Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Account deleted. We\'re sorry to see you go! 💔');
      logout();
      // Redirect to landing page
      window.location.href = '/';
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setIsSaving(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-white">
      {/* Header */}
      <div className="bg-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2 bg-white">
          <SettingsIcon className="h-8 w-8 text-emerald-600" />
          Settings
        </h1>
        <p className="text-slate-500 bg-white">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="bg-white">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-100">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-white">
            <Globe className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Profile Information
              </CardTitle>
              <p className="text-sm text-slate-500">
                Update your personal information and how others see you on SoloHub
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600">
                      {profileForm.fullName?.charAt(0) || 'U'}
                    </div>
                    <button className="absolute bottom-0 right-0 p-1 bg-emerald-600 rounded-full text-white hover:bg-emerald-700 transition">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{profileForm.fullName}</p>
                    <p className="text-sm text-slate-500">{profileForm.email}</p>
                    <p className="text-xs text-emerald-600 mt-1">Free Plan</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <p className="text-sm text-slate-500">
                Permanently delete your account and all associated data
              </p>
            </CardHeader>
            <CardContent>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data including clients, projects, and invoices.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-slate-600">
                      Are you sure you want to delete your account? Type <strong className="text-red-600">DELETE</strong> to confirm.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSaving}>
                      {isSaving ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-emerald-600" />
                Change Password
              </CardTitle>
              <p className="text-sm text-slate-500">
                Update your password to keep your account secure
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-emerald-600" />
                Two-Factor Authentication
              </CardTitle>
              <p className="text-sm text-slate-500">
                Add an extra layer of security to your account
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-medium text-slate-900">2FA Status</p>
                  <p className="text-sm text-slate-500">Not enabled</p>
                </div>
                <Button variant="outline" className="border-slate-300">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-600" />
                Preferences
              </CardTitle>
              <p className="text-sm text-slate-500">
                Customize your SoloHub experience
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={profileForm.currency}
                  onValueChange={(value) => setProfileForm({ ...profileForm, currency: value })}
                >
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="NGN">🇳🇬 NGN - Nigerian Naira</SelectItem>
                    <SelectItem value="KES">🇰🇪 KES - Kenyan Shilling</SelectItem>
                    <SelectItem value="GHS">🇬🇭 GHS - Ghanaian Cedi</SelectItem>
                    <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Africa/Lagos">Africa/Lagos (UTC+1)</SelectItem>
                    <SelectItem value="Africa/Nairobi">Africa/Nairobi (UTC+3)</SelectItem>
                    <SelectItem value="Africa/Accra">Africa/Accra (UTC+0)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive invoice and payment updates</p>
                  </div>
                </div>
                <Button variant="outline" className="border-slate-300">
                  Manage
                </Button>
              </div>

              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                Subscription Plan
              </CardTitle>
              <p className="text-sm text-slate-500">
                Manage your subscription and billing information
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Free Plan</p>
                    <p className="text-sm text-slate-500">₦0 / month</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      <li>✓ Up to 5 clients</li>
                      <li>✓ Up to 10 projects</li>
                      <li>✓ Unlimited invoices</li>
                      <li>✓ Basic analytics</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      Current Plan
                    </span>
                    <Button variant="outline" className="mt-3 border-slate-300 block w-full">
                      Upgrade
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">No payment method added yet.</p>
                <Button variant="outline" className="mt-2 border-slate-300">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;