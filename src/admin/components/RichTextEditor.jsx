import { useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/RichTextEditor.css';
import ImageSelector from './ImageSelector';

// Register custom fonts
const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'arial', 'georgia', 'times-new-roman', 'courier'];
Quill.register(Font, true);

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing...' }) => {
  const quillRef = useRef(null);
  const [imageSelectorVisible, setImageSelectorVisible] = useState(false);

  // Custom image handler that opens our media gallery
  const imageHandler = () => {
    setImageSelectorVisible(true);
  };

  const handleImageSelect = (url) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', url, 'user');
      quill.setSelection(range.index + 1);
    }
    setImageSelectorVisible(false);
  };

  // Enhanced toolbar configuration with more features
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': ['sans-serif', 'serif', 'monospace', 'arial', 'georgia', 'times-new-roman', 'courier'] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <>
      <div className="rich-text-editor">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
      
      <ImageSelector
        open={imageSelectorVisible}
        onClose={() => setImageSelectorVisible(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
};

export default RichTextEditor;

