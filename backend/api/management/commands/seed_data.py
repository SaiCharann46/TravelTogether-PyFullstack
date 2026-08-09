from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import TravelGroup, ChatMessage, OTP

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample users, groups, and messages'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.MIGRATE_HEADING('\n🌱 Seeding database with sample data...\n'))

        # ── Create sample users ──
        users = []
        sample_users = [
            {'username': 'alice',   'email': 'alice@example.com',   'password': 'alice123'},
            {'username': 'bob',     'email': 'bob@example.com',     'password': 'bob123'},
            {'username': 'charlie', 'email': 'charlie@example.com', 'password': 'charlie123'},
        ]

        for ud in sample_users:
            user, created = User.objects.get_or_create(
                username=ud['username'],
                defaults={'email': ud['email'], 'is_verified': True}
            )
            if created:
                user.set_password(ud['password'])
                user.save()
                self.stdout.write(f'  ✅ Created user: {user.username} (password: {ud["password"]})')
            else:
                self.stdout.write(f'  ⚠️  User already exists: {user.username}')
            users.append(user)

        # ── Create sample groups ──
        sample_groups = [
            {
                'name': 'Goa Beach Trip 2025',
                'desc': 'Sun, sand & seafood! A fun beach trip to Goa. Perfect for 5-15 people. Departing Jan 2025.',
                'owner': users[0],
                'messages': [
                    (users[0], 'Hey everyone! Welcome to our Goa trip group 🎉🏖️'),
                    (users[1], 'Super excited! I have been waiting for this trip so long 🌊'),
                    (users[2], 'Who is booking the hotel? Let us split the cost! 🏨'),
                    (users[0], 'I will look into some options and share links here'),
                ]
            },
            {
                'name': 'Manali Adventure Trek',
                'desc': 'Trekking & camping in the mountains of Manali. Bring warm clothes & good spirits! Dec 2025.',
                'owner': users[1],
                'messages': [
                    (users[1], 'Welcome to Manali Adventure Trek! ⛰️❄️'),
                    (users[0], 'This is going to be epic! Is snow expected?'),
                    (users[2], 'Yes! December will definitely have snow. Pack heavy jackets 🧥'),
                ]
            },
            {
                'name': 'Kerala Backwaters Cruise',
                'desc': 'Peaceful houseboat cruise through the beautiful backwaters of Kerala. Relaxing & scenic! 🌿🚢',
                'owner': users[2],
                'messages': [
                    (users[2], 'Welcome to Kerala Backwaters! 🌴🚤'),
                    (users[0], 'Kerala is absolutely beautiful. Can not wait!'),
                    (users[1], 'Have booked 2 houseboats for 3 days. Details in description 📋'),
                ]
            },
            {
                'name': 'Rajasthan Royal Tour',
                'desc': 'Explore royal forts & palaces — Jaipur, Jodhpur, Udaipur, Jaisalmer. History & culture at its best! 🏰',
                'owner': users[0],
                'messages': [
                    (users[0], 'Rajasthan is calling! 🏰🐪'),
                    (users[2], 'I heard the Mehrangarh Fort in Jodhpur is a must-visit!'),
                ]
            },
            {
                'name': 'Leh Ladakh Bike Ride',
                'desc': 'Bike ride through the world\'s highest motorable roads. For adventure lovers only! 🏍️🏔️',
                'owner': users[1],
                'messages': [
                    (users[1], 'Ladakh on bikes! The ultimate adventure 🏍️'),
                    (users[0], 'This has been my dream trip! Count me in 🙌'),
                ]
            },
        ]

        created_groups = []
        for gd in sample_groups:
            if TravelGroup.objects.filter(group_name=gd['name']).exists():
                group = TravelGroup.objects.get(group_name=gd['name'])
                self.stdout.write(f'  ⚠️  Group already exists: {gd["name"]} (Code: {group.group_code})')
            else:
                code = TravelGroup.generate_group_code()
                group = TravelGroup.objects.create(
                    group_name=gd['name'],
                    group_description=gd['desc'],
                    group_code=code,
                    owner=gd['owner']
                )
                # Add all users as members
                for u in users:
                    group.members.add(u)

                # Add sample messages
                for user, msg_text in gd['messages']:
                    ChatMessage.objects.create(group=group, user=user, message=msg_text)

                self.stdout.write(f'  ✅ Created group: {group.group_name} → Code: {self.style.SUCCESS(group.group_code)}')
            created_groups.append(group)

        # ── Print summary ──
        self.stdout.write('\n' + '─' * 50)
        self.stdout.write(self.style.SUCCESS('✅ Seeding complete!\n'))

        self.stdout.write(self.style.MIGRATE_HEADING('👤 Sample Login Credentials:'))
        self.stdout.write('  Email: alice@example.com   | Password: alice123')
        self.stdout.write('  Email: bob@example.com     | Password: bob123')
        self.stdout.write('  Email: charlie@example.com | Password: charlie123')

        self.stdout.write(self.style.MIGRATE_HEADING('\n🗺️  Sample Groups (Name → Code):'))
        for g in TravelGroup.objects.all():
            self.stdout.write(f'  {g.group_name:<35} → Code: {self.style.SUCCESS(g.group_code)}')

        self.stdout.write('\n' + '─' * 50)
        self.stdout.write('💡 Use these credentials to login and test the app!\n')
