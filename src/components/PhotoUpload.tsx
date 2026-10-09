import { useEffect, useRef, useState } from 'react'
import { CameraIcon, XIcon } from './Icons'

interface Props {
  file: File | null
  onChange: (file: File | null) => void
}

export function PhotoUpload({ file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const accept = (candidate: File | undefined) => {
    if (!candidate) return
    if (!candidate.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, HEIC).')
      return
    }
    setError('')
    onChange(candidate)
  }

  const clear = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="field">
      <span className="label">
        Photo of the area <span className="optional">Optional</span>
      </span>

      {preview && file ? (
        <div className="photo-preview">
          <img src={preview} alt="Uploaded property preview" />
          <div className="photo-preview-meta">
            <span className="photo-name">{file.name}</span>
            <div className="photo-actions">
              <button type="button" className="link-button" onClick={() => inputRef.current?.click()}>
                Replace
              </button>
              <button type="button" className="icon-button" onClick={clear} aria-label="Remove photo">
                <XIcon width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          className={`dropzone${dragging ? ' is-dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            accept(e.dataTransfer.files[0])
          }}
        >
          <span className="dropzone-icon">
            <CameraIcon width={26} height={26} />
          </span>
          <span className="dropzone-title">Upload a photo of the area to clear</span>
          <span className="dropzone-hint">Photos help us understand vegetation density and site conditions.</span>
          <span className="dropzone-cta">Choose photo or drag it here</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={(e) => accept(e.target.files?.[0])}
          />
        </label>
      )}
      {/* Keep an input mounted for "Replace" while a preview is showing. */}
      {preview && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="visually-hidden"
          tabIndex={-1}
          onChange={(e) => accept(e.target.files?.[0])}
        />
      )}
      {error && <span className="error">{error}</span>}
    </div>
  )
}
