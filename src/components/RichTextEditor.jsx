import { useMemo, useRef } from 'react'
import JoditEditor from 'jodit-react'

export default function RichTextEditor({ value, onChange }) {
  const editor = useRef(null)
  const config = useMemo(() => ({
    readonly: false,
    height: 500,
    defaultActionOnPaste: 'insert_as_html',
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    cleanHTML: { cleanOnPaste: false, removeFormat: false },
  }), [])

  return <JoditEditor ref={editor} value={value} config={config} tabIndex={1} onBlur={onChange} />
}
