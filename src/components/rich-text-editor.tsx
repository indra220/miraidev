import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Smile
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export default function RichTextEditor({ 
  content, 
  onContentChange
}: RichTextEditorProps) {
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    onContentChange(document.querySelector('[contenteditable="true"]')?.innerHTML || '');
  };

  const insertEmoji = (emoji: string) => {
    const span = document.createElement('span');
    span.textContent = emoji;
    document.querySelector('[contenteditable="true"]')?.appendChild(span);
    onContentChange(document.querySelector('[contenteditable="true"]')?.innerHTML || '');
  };

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-750">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-700 rounded-t-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-600 mx-1"></div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('insertUnorderedList')}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('insertOrderedList')}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-600 mx-1"></div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('formatBlock', 'BLOCKQUOTE')}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('formatBlock', 'CODE')}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-600 mx-1"></div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertEmoji('😊')}
          className="h-8 w-8 p-0"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Editor */}
      <div
        contentEditable
        className="min-h-[150px] p-3 text-gray-200 bg-gray-800 rounded-b-lg focus:outline-none"
        onInput={(e) => onContentChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}