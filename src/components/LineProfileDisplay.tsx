import { useLineContext } from '@/contexts/LineContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const LineProfileDisplay = () => {
  const { isLoggedIn, profile, logout } = useLineContext();

  if (!isLoggedIn || !profile) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
      <Avatar>
        {profile.pictureUrl && (
          <AvatarImage src={profile.pictureUrl} alt={profile.displayName} />
        )}
        <AvatarFallback>
          {profile.displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="font-semibold text-sm">{profile.displayName}</p>
        {profile.statusMessage && (
          <p className="text-xs text-muted-foreground">{profile.statusMessage}</p>
        )}
        <p className="text-xs text-muted-foreground">ID: {profile.userId}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        title="ออกจากระบบ"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};
