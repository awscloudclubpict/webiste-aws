# TODO: Replace AWS S3 with Cloudinary

- [x] Update package.json: Remove @aws-sdk/client-s3 and @aws-sdk/lib-storage dependencies, add cloudinary dependency
- [x] Rewrite src/utils/s3.js: Replace AWS SDK code with Cloudinary SDK, configure with provided credentials, implement uploadToS3 and deleteFromS3 functions
- [x] Install dependencies: Run npm install to install cloudinary
- [x] Verify compatibility: Check that controllers importing from s3.js still work (no changes needed to them)
