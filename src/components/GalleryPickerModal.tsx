import { Link } from 'react-router-dom'
import { Images, X } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { mediaUrl } from '../utils/mediaUrl'
import type { GalleryAsset } from '../types'

interface GalleryPickerModalProps {
  onSelect: (imageUrl: string) => void
  onClose: () => void
}

/** Modal to pick an existing Cloudinary gallery asset. */
export function GalleryPickerModal({
  onSelect,
  onClose,
}: GalleryPickerModalProps) {
  const { galleryAssets } = useCatalog()

  return (
    <div
      className="crop-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Choose from gallery"
      onClick={onClose}
    >
      <div
        className="crop-modal__panel gallery-picker"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="crop-modal__header">
          <div>
            <p className="eyebrow">Gallery</p>
            <h2 className="page-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              Choose an image
            </h2>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {galleryAssets.length === 0 ? (
          <div className="gallery-picker__empty">
            <Images size={28} />
            <p className="page-sub">
              No gallery images yet. Upload some in Gallery first.
            </p>
            <Link to="/gallery" className="btn btn--primary btn--sm" onClick={onClose}>
              Open Gallery
            </Link>
          </div>
        ) : (
          <div className="gallery-picker__grid">
            {galleryAssets.map((asset: GalleryAsset) => (
              <button
                key={asset.id}
                type="button"
                className="gallery-picker__item"
                onClick={() => onSelect(asset.imageUrl)}
              >
                <img
                  src={mediaUrl(asset.imageUrl)}
                  alt={asset.caption || 'Gallery image'}
                />
                {asset.caption ? (
                  <span className="gallery-picker__caption">{asset.caption}</span>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
