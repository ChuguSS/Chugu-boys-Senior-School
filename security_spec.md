# Security Specification — Chugu Boys Senior School Website & CMS

## 1. Data Invariants
1. **Institutional Settings (`settings/{settingId}`)**: Only verified Principal/Admin may modify official school identity, motto, principal profile, vision, mission, or homepage announcements. Public visitors have read-only access.
2. **Pages, Academics, Gallery & Documents (`pages`, `learning_areas`, `gallery`, `documents`)**: Public visitors have read-only access. Only verified Principal/Admin or active designated staff members (`staff_roles/{uid}`) may create, update, or delete records.
3. **News & Announcements (`news/{newsId}`)**: Public visitors may only read and list items where `published == true`. Only the author (`authorUid == request.auth.uid`) or verified Principal may list unpublished drafts. Only verified staff/Principal may publish or modify news.
4. **Parent & Prospective Student Enquiries (`enquiries/{enquiryId}`)**: Any visitor may submit an enquiry (`status == 'new'`), bounded by strict field lengths and server `request.time`. Only the verified Principal may list, read, update status, or delete enquiries to protect parent PII (email, phone).
5. **Staff Roles (`staff_roles/{uid}`)**: Only the bootstrapped Principal (`onlineworksmk@gmail.com` with `email_verified == true`) may list, create, update, or delete staff roles. Authenticated users may only read their own role document (`request.auth.uid == uid`). Self-assigned role escalation is strictly blocked.
6. **Temporal & ID Integrity**: All document IDs match `^[a-zA-Z0-9_-]{1,128}$`. `createdAt` is immutable and equals `request.time` on creation; `updatedAt` equals `request.time` on updates.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: `PERMISSION_DENIED`)
1. **Unverified Admin Email Spoof**: User with `email == 'onlineworksmk@gmail.com'` and `email_verified == false` attempts to update `/settings/school_profile`.
2. **Self-Assigned Staff Role**: Signed-in non-admin user attempts `create` on `/staff_roles/{theirUid}` with `role: 'principal'`.
3. **Shadow Field Injection on News**: Staff member creates `/news/notice-1` including an extra shadow field `isOfficialVerified: true`.
4. **Cross-User Author Spoofing**: Teacher A creates `/news/notice-2` with `authorUid: "teacher-b-uid"`.
5. **Unpublished Draft Scraping**: Anonymous visitor runs a `list` query on `/news` without filtering `published == true`.
6. **PII Leak Attempt on Enquiries**: Anonymous or non-Principal user attempts `get` or `list` on `/enquiries`.
7. **Status Forgery on Enquiry Creation**: Visitor submits `/enquiries/enq-1` with `status: 'responded'` instead of `'new'`.
8. **Timestamp Forgery**: Authenticated staff creates `/documents/doc-1` with backdated `createdAt` not equal to `request.time`.
9. **Immutable Field Tampering**: Staff updates `/news/notice-1` and attempts to alter `createdAt` or `authorUid`.
10. **Oversized String / Resource Poisoning**: Visitor submits `/enquiries/enq-2` with a 50,000-character `message` string or 500-char document ID.
11. **Unsafe Image URL Injection**: Staff creates `/gallery/img-1` with `imageUrl: "javascript:alert(1)"` or `"data:text/html,<script>..."`.
12. **Teacher Privilege Escalation to Settings**: Designated teacher (non-Principal) attempts to overwrite `/settings/school_profile` or delete `/staff_roles/{otherUid}`.
