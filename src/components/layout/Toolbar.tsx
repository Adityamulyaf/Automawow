import type { Tool } from '../../types/editor';
import { useAutomaton } from '../../context/AutomatonContext';
import {
  IconSelect,
  IconPan,
  IconAddState,
  IconAddTransition,
  IconSetStart,
  IconToggleAccept,
  IconDelete,
  IconLayout,
  IconReset,
} from '../shared/Icons';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

type ToolDef = {
  id: Tool;
  title: string;
  Icon: React.ComponentType<{ size?: number }>;
};

const tools: ToolDef[] = [
  { id: 'select',         title: 'Select / Move (V)',  Icon: IconSelect },
  { id: 'pan',            title: 'Pan Canvas (H)',      Icon: IconPan },
  { id: 'addState',       title: 'Add State (S)',       Icon: IconAddState },
  { id: 'addTransition',  title: 'Add Transition (T)',  Icon: IconAddTransition },
  { id: 'setStart',       title: 'Set Start State',     Icon: IconSetStart },
  { id: 'toggleAccept',   title: 'Toggle Accept State', Icon: IconToggleAccept },
  { id: 'delete',         title: 'Delete (Del)',         Icon: IconDelete },
];

export default function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  const { dispatch, showConfirm } = useAutomaton();

  return (
    <aside
      className="flex flex-col gap-0.5 border-r border-[var(--color-border)] bg-white p-1.5"
      style={{ width: 48 }}
    >
      {tools.map(({ id, title, Icon }) => {
        const active = id === activeTool;
        return (
          <button
            key={id}
            title={title}
            onClick={() => onToolChange(id)}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors duration-100 ${
              active
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Icon size={18} />
          </button>
        );
      })}

      <div className="mt-auto flex flex-col gap-0.5">
        <button
          title="Auto Layout"
          onClick={() => dispatch({ type: 'AUTO_LAYOUT' })}
          className="w-9 h-9 flex items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-100"
        >
          <IconLayout size={18} />
        </button>
        <button
          title="Reset / Clear"
          onClick={() => {
            showConfirm({
              title: 'Reset Automaton',
              message: 'Are you sure you want to reset and clear the current automaton?',
              onConfirm: () => {
                dispatch({ type: 'RESET' });
              },
            });
          }}
          className="w-9 h-9 flex items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-100"
        >
          <IconReset size={18} />
        </button>
      </div>
    </aside>
  );
}
