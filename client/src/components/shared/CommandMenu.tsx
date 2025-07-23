import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Home, Wallet, Settings, Plus, X, Search } from 'lucide-react';

interface CommandMenuProps {
  onAddTransaction: () => void;
}

export const CommandMenu = ({ onAddTransaction }: CommandMenuProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      {/* --- THIS IS THE UPDATED BUTTON --- */}
      <button 
        onClick={() => setOpen(true)} 
        className="fixed top-1/2 -right-12 -translate-y-1/2 rotate-90 origin-bottom-right
                   p-2 pl-4 bg-background/50 border-t border-l border-r border-white/10 
                   rounded-t-lg text-sm text-foreground/80
                   hidden md:flex items-center gap-2 
                   hover:bg-white/10 hover:text-foreground transition-all duration-300"
        aria-label="Open command menu"
      >
        <span>Command</span>
        <kbd className="font-sans bg-primary/20 text-primary px-1.5 py-0.5 rounded">⌘ K</kbd>
      </button>

      <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" cmdk-overlay="" />
        
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg" cmdk-dialog-wrapper="">
            <div className="glass-card text-foreground rounded-xl border border-white/10 shadow-lg" cmdk-dialog="">
                <div className="flex items-center px-4 border-b border-white/10">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Command.Input 
                        placeholder="Type a command or search..." 
                        className="w-full bg-transparent p-4 focus:outline-none placeholder:text-foreground/60" 
                    />
                    <button onClick={() => setOpen(false)} className="p-2 text-foreground/60 rounded-md hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>
                <Command.List className="p-2 max-h-[300px] overflow-y-auto">
                    <Command.Empty>No results found.</Command.Empty>
                    <Command.Group heading="Navigation">
                        <Command.Item onSelect={() => runCommand(() => navigate('/'))} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10">
                            <Home size={16} /> Go to Dashboard
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => navigate('/profile'))} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10">
                            <Wallet size={16} /> View Profile
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => navigate('/settings'))} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10">
                            <Settings size={16} /> Open Settings
                        </Command.Item>
                    </Command.Group>
                    <Command.Group heading="Actions">
                        <Command.Item onSelect={() => runCommand(onAddTransaction)} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10">
                            <Plus size={16} /> Add New Transaction
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </div>
        </div>
      </Command.Dialog>
    </>
  );
};