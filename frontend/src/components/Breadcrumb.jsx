import React from 'react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  const crumbs = items || [
    { label: 'Amazon', to: '/marketplace' },
    { label: 'Seller Tools', to: '/' },
    { label: 'SecondLife Grader', current: true },
  ]

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[#007185] py-3">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, index) => (
          <React.Fragment key={`${crumb.label}-${index}`}>
            {index > 0 && (
              <li className="text-[#565959]" aria-hidden="true">
                ›
              </li>
            )}
            <li>
              {crumb.current ? (
                <span className="text-[#565959]">{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className="hover:text-[#c7511f] hover:underline">
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
