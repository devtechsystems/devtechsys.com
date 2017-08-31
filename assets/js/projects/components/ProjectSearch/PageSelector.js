import React from 'react'

export default function({ currentPage, totalPages, onPrevious, onNext }) {
  return (
    <div className="page-selector column small-8 medium-6 large-6">
      <div className="row">
        <div className="page-prev-button column small-4" onClick={onPrevious}><span className="fa fa-angle-left" /></div>
        <div className="current-page column small-8">{currentPage} of {totalPages}</div>
        <div className="page-next-button column small-4" onClick={onNext}><span className="fa fa-angle-right" /></div>
      </div>
    </div>
  )
}
