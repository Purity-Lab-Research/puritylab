-- ============================================================
-- Fix RLS infinite recursion on profiles table
--
-- The admin check in policies sub-queries profiles, which has
-- its own RLS that checks auth.uid(), causing infinite recursion.
--
-- Fix: SECURITY DEFINER function bypasses RLS on the profiles
-- lookup. Replace every admin policy to use it.
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── Products ───
DROP POLICY IF EXISTS "Admin manage products" ON products;
CREATE POLICY "Admin manage products" ON products FOR ALL
  USING (public.is_admin());

-- ─── Categories ───
DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories FOR ALL
  USING (public.is_admin());

-- ─── COA (table is named "coa") ───
DROP POLICY IF EXISTS "Admin manage COAs" ON coa;
DROP POLICY IF EXISTS "Admin manage coa" ON coa;
CREATE POLICY "Admin manage coa" ON coa FOR ALL
  USING (public.is_admin());

-- ─── Profiles ───
DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;
CREATE POLICY "Admin read all profiles" ON profiles FOR SELECT
  USING (public.is_admin());

-- ─── Orders ───
DROP POLICY IF EXISTS "Admin manage orders" ON orders;
CREATE POLICY "Admin manage orders" ON orders FOR ALL
  USING (public.is_admin());

-- ─── Order Items ───
DROP POLICY IF EXISTS "Admin manage order items" ON order_items;
CREATE POLICY "Admin manage order items" ON order_items FOR ALL
  USING (public.is_admin());

-- ─── Subscriptions ───
DROP POLICY IF EXISTS "Admin manage subscriptions" ON subscriptions;
CREATE POLICY "Admin manage subscriptions" ON subscriptions FOR ALL
  USING (public.is_admin());

-- ─── Discounts (table is named "discounts") ───
DROP POLICY IF EXISTS "Admin manage codes" ON discounts;
DROP POLICY IF EXISTS "Admin manage discounts" ON discounts;
CREATE POLICY "Admin manage discounts" ON discounts FOR ALL
  USING (public.is_admin());

-- ─── Product Variants ───
DROP POLICY IF EXISTS "Admin manage variants" ON product_variants;
CREATE POLICY "Admin manage variants" ON product_variants FOR ALL
  USING (public.is_admin());

-- ─── Related Products ───
DROP POLICY IF EXISTS "Admins can manage related products" ON related_products;
CREATE POLICY "Admins can manage related products" ON related_products FOR ALL
  USING (public.is_admin());

-- ─── Product Tags ───
DROP POLICY IF EXISTS "Admins can manage tags" ON product_tags;
CREATE POLICY "Admins can manage tags" ON product_tags FOR ALL
  USING (public.is_admin());

-- ─── Product Tag Links ───
DROP POLICY IF EXISTS "Admins can manage tag links" ON product_tag_links;
CREATE POLICY "Admins can manage tag links" ON product_tag_links FOR ALL
  USING (public.is_admin());

-- ─── Product Reviews ───
DROP POLICY IF EXISTS "Admins can manage all reviews" ON product_reviews;
CREATE POLICY "Admins can manage all reviews" ON product_reviews FOR ALL
  USING (public.is_admin());

-- ─── Order Notes ───
DROP POLICY IF EXISTS "Admins can manage order notes" ON order_notes;
CREATE POLICY "Admins can manage order notes" ON order_notes FOR ALL
  USING (public.is_admin());

-- ─── Back in Stock ───
DROP POLICY IF EXISTS "Admins can view back-in-stock requests" ON back_in_stock_requests;
CREATE POLICY "Admins can view back-in-stock requests" ON back_in_stock_requests FOR ALL
  USING (public.is_admin());

-- ─── Audit Logs ───
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT
  USING (public.is_admin());

-- ─── Inbox Messages ───
DROP POLICY IF EXISTS "Admins can manage inbox" ON inbox_messages;
CREATE POLICY "Admins can manage inbox" ON inbox_messages FOR ALL
  USING (public.is_admin());

-- ─── Protocols ───
DROP POLICY IF EXISTS "Admin manage protocols" ON protocols;
CREATE POLICY "Admin manage protocols" ON protocols FOR ALL
  USING (public.is_admin());

-- ─── Protocol Items ───
DROP POLICY IF EXISTS "Admin manage protocol items" ON protocol_items;
CREATE POLICY "Admin manage protocol items" ON protocol_items FOR ALL
  USING (public.is_admin());

-- ─── Subscription Items ───
DROP POLICY IF EXISTS "Admin manage subscription items" ON subscription_items;
CREATE POLICY "Admin manage subscription items" ON subscription_items FOR ALL
  USING (public.is_admin());

-- ─── Fulfillment policies (also reference profiles) ───
DROP POLICY IF EXISTS "Fulfillment read orders" ON orders;
DROP POLICY IF EXISTS "Users read own orders" ON orders;
CREATE POLICY "Users and fulfillment read orders" ON orders FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'fulfillment')
  );

DROP POLICY IF EXISTS "Fulfillment update orders" ON orders;
CREATE POLICY "Fulfillment update orders" ON orders FOR UPDATE
  USING (
    public.is_admin()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'fulfillment')
  );

DROP POLICY IF EXISTS "Fulfillment read order_items" ON order_items;
DROP POLICY IF EXISTS "Users read own order items" ON order_items;
CREATE POLICY "Users and fulfillment read order_items" ON order_items FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'fulfillment')
    OR EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
