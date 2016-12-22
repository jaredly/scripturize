deploy:
	NODE_ENV=production npm run build
	(cd public; surge .)
