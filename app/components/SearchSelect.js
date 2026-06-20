'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

export default function SearchSelect({
  value,
  onChange,
  options = [], // [{ value, label, subtitle }] or strings
  placeholder = 'Select option...',
  disabled = false,
  className = '',
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Normalize options to objects { value, label }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  // Filter options based on query
  const filtered = normalizedOptions.filter(opt => {
    const labelMatch = opt.label?.toLowerCase().includes(searchQuery.toLowerCase());
    const valMatch = opt.value?.toLowerCase().includes(searchQuery.toLowerCase());
    const subMatch = opt.subtitle ? opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return labelMatch || valMatch || subMatch;
  });

  // Find currently selected option object
  const selectedOpt = normalizedOptions.find(o => o.value === value);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search query when dropdown opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  return (
    <div 
      ref={containerRef} 
      className={`search-select-container ${className}`} 
      style={{ position: 'relative', width: '100%', ...style }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="search-select-trigger"
        style={{
          width: '100%',
          height: '40px',
          padding: '0 12px',
          borderRadius: '10px',
          border: '1px solid var(--line-2, #d1d5db)',
          background: disabled ? 'var(--surface-2, #f3f4f6)' : '#fff',
          color: selectedOpt ? 'var(--ink, #000)' : 'var(--ink-3, #6b7280)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: '600',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(10,10,10,.05)' : 'none',
          borderColor: isOpen ? 'var(--line-strong, #374151)' : 'var(--line-2, #d1d5db)',
          transition: 'all 0.15s ease'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <ChevronDown 
          className="ic" 
          style={{ 
            width: '16px', 
            height: '16px', 
            opacity: 0.6, 
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease',
            flexShrink: 0
          }} 
        />
      </button>

      {isOpen && (
        <div 
          className="search-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid var(--line-strong, #374151)',
            borderRadius: '12px',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
            zIndex: 10000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'dl-fadeIn 0.12s ease'
          }}
        >
          {/* Search box inside dropdown */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px 12px', 
              borderBottom: '1px solid var(--line, #e5e7eb)' 
            }}
          >
            <Search 
              style={{ 
                width: '15px', 
                height: '15px', 
                color: 'var(--ink-3, #6b7280)', 
                marginRight: '8px',
                flexShrink: 0
              }} 
            />
            <input
              type="text"
              className="search-select-input"
              placeholder="Search..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                fontFamily: 'inherit',
                color: 'var(--ink, #000)'
              }}
            />
          </div>

          {/* Option list */}
          <div 
            className="search-select-options-list"
            style={{ 
              maxHeight: '200px', 
              overflowY: 'auto',
              padding: '4px'
            }}
          >
            {filtered.length === 0 ? (
              <div 
                style={{ 
                  padding: '12px', 
                  fontSize: '13px', 
                  color: 'var(--ink-3, #6b7280)', 
                  textAlign: 'center' 
                }}
              >
                No options found
              </div>
            ) : (
              filtered.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? 'var(--accent-bg, #f3f4f6)' : 'transparent',
                      color: isSelected ? 'var(--accent-2, #111827)' : 'var(--ink-2, #374151)',
                      fontSize: '13.5px',
                      fontWeight: isSelected ? '700' : '500',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'var(--surface-2, #f3f4f6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, marginRight: '8px' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {opt.label}
                      </span>
                      {opt.subtitle && (
                        <span style={{ fontSize: '11px', color: 'var(--ink-3, #6b7280)', marginTop: '2px' }}>
                          {opt.subtitle}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="ic" style={{ width: '14px', height: '14px', color: 'var(--accent, #4f46e5)', flexShrink: 0 }} />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dl-fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
