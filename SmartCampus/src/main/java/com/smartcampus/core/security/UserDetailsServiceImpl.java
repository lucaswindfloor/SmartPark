package com.smartcampus.core.security;

import com.smartcampus.infrastructure.persistence.mysql.entity.PermissionPO;
import com.smartcampus.infrastructure.persistence.mysql.entity.RolePO;
import com.smartcampus.infrastructure.persistence.mysql.entity.UserPO;
import com.smartcampus.infrastructure.persistence.mysql.mapper.security.PermissionMapper;
import com.smartcampus.infrastructure.persistence.mysql.mapper.security.RoleMapper;
import com.smartcampus.infrastructure.persistence.mysql.mapper.security.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final PermissionMapper permissionMapper;

    @Override
    @Transactional(readOnly = true) // Use read-only transaction
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Attempting to load user by username: {}", username);
        UserPO userPO = userMapper.findByUsername(username);

        if (userPO == null) {
            log.warn("User not found with username: {}", username);
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        Set<RolePO> roles = roleMapper.selectRolesByUserId(userPO.getId());
        if (roles == null || roles.isEmpty()) {
             log.warn("User '{}' has no roles assigned.", username);
        }

        Set<String> permissionStrings = new HashSet<>();
        if (roles != null) {
            for (RolePO role : roles) {
                Set<String> rolePermissions = permissionMapper.selectPermissionsByRoleId(role.getId());
                if (rolePermissions != null) {
                    permissionStrings.addAll(rolePermissions);
                }
            }
        }

        List<GrantedAuthority> authorities = permissionStrings.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        log.debug("Final authorities for user {}: {}", username, authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet()));

        boolean enabled = !userPO.getDeleted();
        boolean accountNonLocked = !userPO.getStatus();
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;

        return new User(
                userPO.getUsername(),
                userPO.getPasswordHash(),
                enabled,
                accountNonExpired,
                credentialsNonExpired,
                accountNonLocked,
                authorities
        );
    }
} 