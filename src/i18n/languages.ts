export const languages = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const;

export type Language = keyof typeof languages;

export const translations = {
  en: {
    hero: {
      title: 'Connecting the Game Industry of Vietnam',
      subtitle: 'Empower collaboration, innovation, and sustainable growth across the entire game industry ecosystem',
      cta: 'Get Started'
    },
    about: {
      title: 'About GameGeek',
      description: 'We are a team of passionate developers, designers, and technology enthusiasts dedicated to creating innovative digital solutions that drive business growth.',
      experience: 'With over 5 years of experience in the industry, we\'ve helped hundreds of businesses transform their digital presence and achieve their goals.'
    },
    features: {
      title: 'Why Choose GameGeek?',
      subtitle: 'We combine cutting-edge technology with creative design to deliver exceptional digital experiences.'
    },
    cta: {
      title: 'Ready to Transform Your Digital Presence?',
      subtitle: 'Let\'s work together to create something amazing. Get in touch with our team today and let\'s discuss how we can help your business grow.',
      button: 'Start Your Project'
    }
  },
  vi: {
    hero: {
      title: 'Kết nối ngành Game Việt Nam',
      subtitle: 'Thúc đẩy hợp tác, đổi mới và tăng trưởng bền vững trong toàn bộ hệ sinh thái ngành game',
      cta: 'Bắt đầu'
    },
    about: {
      title: 'Về GameGeek',
      description: 'Chúng tôi là một đội ngũ phát triển, thiết kế và những người đam mê công nghệ, tận tâm tạo ra các giải pháp kỹ thuật số sáng tạo thúc đẩy tăng trưởng kinh doanh.',
      experience: 'Với hơn 5 năm kinh nghiệm trong ngành, chúng tôi đã giúp hàng trăm doanh nghiệp chuyển đổi sự hiện diện kỹ thuật số và đạt được mục tiêu của họ.'
    },
    features: {
      title: 'Tại sao chọn GameGeek?',
      subtitle: 'Chúng tôi kết hợp công nghệ tiên tiến với thiết kế sáng tạo để mang lại trải nghiệm kỹ thuật số đặc biệt.'
    },
    cta: {
      title: 'Sẵn sàng chuyển đổi sự hiện diện kỹ thuật số?',
      subtitle: 'Hãy cùng chúng tôi tạo ra điều gì đó tuyệt vời. Liên hệ với đội ngũ của chúng tôi ngay hôm nay và hãy thảo luận về cách chúng tôi có thể giúp doanh nghiệp của bạn phát triển.',
      button: 'Bắt đầu dự án'
    }
  }
} as const;

export const defaultLanguage: Language = 'en';


