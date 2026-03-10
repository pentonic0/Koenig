# Next.js Koenig standalone example

This example keeps only the Koenig editor integration layer (no Ghost backend/admin/theme dependencies).

## Install

```bash
npm install @tryghost/koenig-lexical
```

## Files

- `components/KoenigNextEditor.jsx`: reusable client component wrapping Koenig + `Export HTML`.
- `app/page.jsx`: example Next.js page using the component.

## Notes

- The demo uploader uses local `blob:` URLs for media previews so image/file cards work without a backend.
- Replace `createLocalUploader` with your API upload hook when connecting to production storage.
