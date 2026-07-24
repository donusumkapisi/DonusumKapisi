-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'genel',
ADD COLUMN     "district" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "blog_posts_category_idx" ON "blog_posts"("category");

-- CreateIndex
CREATE INDEX "blog_posts_published_createdAt_idx" ON "blog_posts"("published", "createdAt");

-- CreateIndex
CREATE INDEX "blog_posts_province_district_idx" ON "blog_posts"("province", "district");
