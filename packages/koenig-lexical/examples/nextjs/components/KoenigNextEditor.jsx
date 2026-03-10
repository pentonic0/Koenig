'use client';

import React, {useMemo, useState} from 'react';
import {
    HtmlOutputPlugin,
    KoenigComposer,
    KoenigEditor
} from '@tryghost/koenig-lexical';

const fileTypes = {
    image: {
        extensions: ['gif', 'jpg', 'jpeg', 'png', 'svg', 'svgz', 'webp']
    },
    video: {
        extensions: ['mp4', 'webm', 'ogv']
    },
    audio: {
        extensions: ['mp3', 'wav', 'ogg', 'm4a']
    },
    mediaThumbnail: {
        extensions: ['gif', 'jpg', 'jpeg', 'png', 'webp']
    },
    file: {
        extensions: []
    }
};

function createLocalUploader(type = '') {
    return function useFileUploadFn() {
        const [isLoading, setIsLoading] = useState(false);
        const [progress, setProgress] = useState(100);
        const [errors, setErrors] = useState([]);
        const [filesNumber, setFilesNumber] = useState(0);

        const validate = (files = []) => {
            if (type === 'file') {
                return [];
            }

            const supportedExtensions = fileTypes[type]?.extensions ?? [];

            return files
                .map((file) => {
                    const extension = file.name.split('.').pop()?.toLowerCase();

                    if (!supportedExtensions.length || (extension && supportedExtensions.includes(extension))) {
                        return null;
                    }

                    return {
                        fileName: file.name,
                        message: `Unsupported file type. Use: ${supportedExtensions.join(', ')}`
                    };
                })
                .filter(Boolean);
        };

        const upload = async (files = []) => {
            setIsLoading(true);
            setFilesNumber(files.length);
            setProgress(20);

            const validationErrors = validate(Array.from(files));
            if (validationErrors.length) {
                setErrors(validationErrors);
                setIsLoading(false);
                setProgress(100);
                return null;
            }

            const uploadResult = Array.from(files).map((file) => ({
                fileName: file.name,
                url: URL.createObjectURL(file)
            }));

            setErrors([]);
            setProgress(100);
            setIsLoading(false);

            return uploadResult;
        };

        return {isLoading, progress, errors, filesNumber, upload};
    };
}

export default function KoenigNextEditor({initialHtml = ''}) {
    const [html, setHtml] = useState(initialHtml);

    const fileUploader = useMemo(() => ({
        useFileUpload: createLocalUploader,
        fileTypes
    }), []);

    const exportHtml = async () => {
        if (!html) {
            return;
        }

        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(html);
        }

        const blob = new Blob([html], {type: 'text/html;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'koenig-export.html';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="koenig-nextjs-wrapper" style={{margin: '0 auto', maxWidth: '820px', padding: '32px 20px'}}>
            <KoenigComposer fileUploader={fileUploader}>
                <KoenigEditor />
                <HtmlOutputPlugin html={html} setHtml={setHtml} />
            </KoenigComposer>

            <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
                <button
                    onClick={exportHtml}
                    style={{
                        background: '#15171A',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        padding: '10px 14px'
                    }}
                    type="button"
                >
                    Export HTML
                </button>
            </div>

            <textarea
                readOnly
                style={{
                    border: '1px solid #D5D8DC',
                    borderRadius: '8px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '13px',
                    marginTop: '16px',
                    minHeight: '180px',
                    padding: '12px',
                    width: '100%'
                }}
                value={html}
            />
        </div>
    );
}
