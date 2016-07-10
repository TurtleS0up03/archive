# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs
alias getwip = 'wget http://ipinfo.io/ip -qO -'

PATH=$PATH:$HOME/.local/bin:$HOME/bin

export PATH
